import { NextFunction, Request, Response } from "express";
import { IUserAuth } from "../../interfaces/repositories/IUserAuth";
import { User as UserModel } from "../../entites/User";
import { UserService } from "../../services/UserService";
import { Token } from "../../external/Token";
import { Mailer } from "../../external/Mailer";
import { HttpStatusCode } from "../utils/HttpStatusCode";
import {
  ErrorMessages,
  SuccessMessages,
  GenericMessages,
} from "../utils/Constants";

export class authController {
  private authService: IUserAuth;
  private tokenService: Token;

  constructor(authService: IUserAuth) {
    this.authService = authService;
    this.tokenService = new Token();
  }

  async onRegisterUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, confirmPassword } = req.body;
      console.log("cred", name, email, password, confirmPassword);

      if (!name || !email || !password || !confirmPassword) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          error: ErrorMessages.ALL_FIELDS_REQUIRED,
          missingFields: {
            name: !name,
            email: !email,
            password: !password,
            confirmPassword: !confirmPassword,
          },
        });
      }

      if (password !== confirmPassword) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ error: ErrorMessages.PASSWORDS_DO_NOT_MATCH });
      }

      const existingUser = await this.authService.findUserByEmail(email);

      if (existingUser) {
        if (existingUser.verified) {
          return res
          .status(HttpStatusCode.CONFLICT)
          .json({ error: ErrorMessages.USER_ALREADY_EXISTS });
        }
       return res
          .status(HttpStatusCode.CONFLICT)
          .json({ error: ErrorMessages.REGISTRATION_PENDING_VERIFICATION });
      }

      const user = await this.authService.registerUser(name, email, password);
      return res
        .status(HttpStatusCode.CREATED)
        .json({
          message:
            SuccessMessages.USER_REGISTERED,
        });
    } catch (error) {
      console.error("Registration error:", error);
      return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ error: ErrorMessages.REGISTRATION_FAILED });
    }
  }
  async authCallbackController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("enter into google auth conyroller.")
    try {
      console.log("call back fun in controller with user data : ", req.user)
      const user = req.user as any
      
      if (!user) {
        return res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json({ message: ErrorMessages.AUTHENTICATION_FAILED });
      }

      const {accessToken, refreshToken} = this.tokenService.generateTokens(
        user._id
      )
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      res.cookie("accessToken", accessToken, {
        httpOnly: false,
        secure: true,
        maxAge: 15 * 60 * 1000,
      })
      return res.redirect(
        `${process.env.CLIENT_URL}?accessToken=${accessToken}`
      )
    } catch (error) {
      next(error)
    }
  }

  async onUserFind(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId as string
      const user = await this.authService.findUserById(userId)
      let data = {
        id: user?._id,
        name :user?.name,
        email: user?.email,
        verified: user?.verified,
        profilepic: user?.profilepic,
      }
      return res.json(data)
    } catch (error) {
      console.log(error)
    }
  }

  async onVerifyUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      console.log("Email:", email, "OTP:", otp); 

      
         if (!email || !otp) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ error: ErrorMessages.EMAIL_AND_OTP_REQUIRED });
      }

      const verifiedUser = await this.authService.verifyUser(email, otp);

      if (!verifiedUser) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ error: ErrorMessages.INVALID_OTP_OR_EXPIRED });
      }

      return res.json({ message: SuccessMessages.USER_VERIFIED });
    } catch (error) {
      console.error("Verification error:", error);
      return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ error: ErrorMessages.AUTHENTICATION_FAILED });
    }
  }
  async onResendOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      if (!email) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ error: ErrorMessages.EMAIL_REQUIRED });
      }

      await this.authService.resendOTP(email);
      return res.json({ message: SuccessMessages.OTP_SENT });
    } catch (error) {
      console.error("Resend OTP error:", error);
      return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ error: ErrorMessages.OTP_RESEND_FAILED });
    }
  }
 
  async onLoginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      console.log("cred", email, password);

  if (!email || !password) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ error: ErrorMessages.ALL_FIELDS_REQUIRED });
      }
  
      const user = await this.authService.loginUser(email, password);
      console.log("controller user", user?._id);
      if (!user) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ error:ErrorMessages.LOGIN_FAILED });
      }  
      
      if (user.isBlocked) {
        return res.status(HttpStatusCode.FORBIDDEN).json({ error:  ErrorMessages.ACCOUNT_BLOCKED });
      } 
      const tokens = this.tokenService.generateTokens(user._id);
      res.cookie("accessToken", tokens.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        message: "Login successful",
        user:{
          _id:user._id,
          name:user.name,
          email: user.email,
          profilepic:user.profilepic,
          createdAt:user.createdAt,
          subscription:user.subscription || null,
        },
        tokens,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error:  ErrorMessages.DEFAULT_ERROR });
    }
  }
  async onLogoutUser(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({  error: ErrorMessages.LOGOUT_FAILED});
    }
  }
 async getUserById(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const user = await this.authService.findUserById(userId); 
      res.status(HttpStatusCode.OK).json(user);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatusCode.BAD_REQUEST).json({ error: err.message });
    }
  }
  async updateUserDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId; 
      const { name, profilepic } = req.body;

      if (!userId) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ 
          success: false,
          error: ErrorMessages.UNAUTHORIZED
        });
      }

      if (!name && !profilepic) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          success: false,
          error: ErrorMessages.ALL_FIELDS_REQUIRED
        });
      }
      const updateData: { name?: string; profilepic?: string } = {};
      if (name) updateData.name = name;
      if (profilepic) updateData.profilepic = profilepic;

      const updatedUser = await this.authService.updateUserDetails(userId, updateData);

      if (!updatedUser) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          success: false,
          error: ErrorMessages.USER_NOT_FOUND,
        });
      }

      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: "User details updated successfully",
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          profilepic: updatedUser.profilepic
        }
      });

    } catch (error) {
      console.error("Error updating user details:", error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: ErrorMessages.UPDATE_FAILED
      });
    }
  }
  async onForgotPasswordRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ error: ErrorMessages.EMAIL_REQUIRED });
      }
  
      const success = await this.authService.forgotPasswordRequest(email);
  
      if (!success) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ error: ErrorMessages.USER_NOT_FOUND });
      }
  
      return res.status(HttpStatusCode.OK).json({ message: SuccessMessages.PASSWORD_RESET_SUCESSFULY });
    } catch (error) {
      console.error("Forgot password request error:", error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.FORGOT_PASSWORD_FAILED});
    }
  }
  
  async onResetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp, newPassword, confirmPassword } = req.body;
  
      if (!email || !otp || !newPassword || !confirmPassword) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ error:  ErrorMessages.ALL_FIELDS_REQUIRED });
      }
  
      if (newPassword !== confirmPassword) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ error:  ErrorMessages.ALL_FIELDS_REQUIRED });
      }
  
      const success = await this.authService.resetPassword(email, otp, newPassword);
  
      if (!success) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ error: ErrorMessages.INVALID_OR_EXPIRED_OTP });
      }
  
      return res.status(HttpStatusCode.OK).json({ message: SuccessMessages.PASSWORD_RESET_SUCESSFULY });
    } catch (error) {
      console.error("Password reset error:", error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error:  ErrorMessages.RESET_PASSWORD_FAILED });
    }
  }
}
