import { NextFunction, Request, Response } from "express";
import { IUserAuth } from "../../interfaces/repositories/IUserAuth";
import { User as UserModel } from "../../entites/User";
import { UserService } from "../../services/UserService";
import { Token } from "../../external/Token";
import { Mailer } from "../../external/Mailer";
// const userService = new UserService();

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
        return res.status(400).json({
          error: "All fields are required",
          missingFields: {
            name: !name,
            email: !email,
            password: !password,
            confirmPassword: !confirmPassword,
          },
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords don't match" });
      }

      const existingUser = await this.authService.findUserByEmail(email);

      if (existingUser) {
        if (existingUser.verified) {
          return res
            .status(409)
            .json({ error: "User already exists with this email" });
        }
        return res
          .status(409)
          .json({ error: "User registration is pending verification" });
      }

      const user = await this.authService.registerUser(name, email, password);
      return res
        .status(201)
        .json({
          message:
            "User registered successfully. Please check your email for OTP.",
        });
    } catch (error) {
      console.error("Registration error:", error);
      return res
        .status(500)
        .json({ error: "Registration failed. Please try again." });
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
        return res.status(401).json({message: "Authentication failed"})
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

      if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP are required" });
      }

      const verifiedUser = await this.authService.verifyUser(email, otp);

      if (!verifiedUser) {
        return res.status(400).json({ error: "Invalid OTP or OTP expired" });
      }

      return res.json({ message: "User verified successfully" });
    } catch (error) {
      console.error("Verification error:", error);
      return res
        .status(500)
        .json({ error: "An error occurred during verification" });
    }
  }
  async onResendOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      await this.authService.resendOTP(email);
      return res.json({ message: "New OTP sent successfully" });
    } catch (error) {
      console.error("Resend OTP error:", error);
      return res.status(500).json({ error: "Failed to resend OTP" });
    }
  }
 
  async onLoginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      console.log("cred", email, password);
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const user = await this.authService.loginUser(email, password);
      console.log("controller user", user?._id);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }  
      
      if (user.isBlocked) {
        return res.status(403).json({ error: "Access denied: Your account has been blocked. Please contact support for assistance." });
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
      return res.status(500).json({ error: "An unexpected error occurred" });
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
      return res.status(500).json({ error: "An unexpected error occurred during logout" });
    }
  }
 async getUserById(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const user = await this.authService.findUserById(userId); // Call updated method
      res.status(200).json(user);
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ error: err.message });
    }
  }
  async updateUserDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId; 
      const { name, profilepic } = req.body;

      // Validate inputs
      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized: User ID not found" 
        });
      }

      if (!name && !profilepic) {
        return res.status(400).json({
          success: false,
          error: "At least one field (name or profile picture) must be provided for update"
        });
      }
      // Create update object with only provided fields
      const updateData: { name?: string; profilepic?: string } = {};
      if (name) updateData.name = name;
      if (profilepic) updateData.profilepic = profilepic;

      // Update user
      const updatedUser = await this.authService.updateUserDetails(userId, updateData);

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          error: "User not found"
        });
      }

      // Return success response
      return res.status(200).json({
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
      return res.status(500).json({
        success: false,
        error: "An error occurred while updating user details"
      });
    }
  }
 
}
