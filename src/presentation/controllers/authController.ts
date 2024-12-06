import {NextFunction, Request, Response } from "express";
import { IUserAuth } from "../../interfaces/repositories/IUserAuth";
import { User } from "../../entites/User";
import { UserService } from "../../services/UserService";
import { error } from "console";
import { Token } from '../../external/Token';
import { Mailer } from "../../external/Mailer";
// const userService = new UserService();


export class authController{
    private authService:IUserAuth
    constructor(authService:IUserAuth){
        this.authService=authService
    }

    async onRegisterUser(req: Request, res: Response, next: NextFunction) {
  try {
    console.log('Received signup request body:', req.body);

    const { name, email, password, confirmpassword } = req.body;

    if (!name || !email || !password || !confirmpassword) {
      return res.status(400).json({ 
        error: "All fields are required",
        missingFields: {
          name: !name,
          email: !email,
          password: !password,
          confirmpassword: !confirmpassword,
        }
      });
    }

    const existingUser = await this.authService.findUserByEmail(email);

    if (existingUser) {
        if (existingUser.verified) {
            return res
                .status(409)
                .json({ error: "Verification Link Already Sent" });
        }
        return res
            .status(409)
            .json({ error: "User Already Exists with Given Email" });
    }

    if (password !== confirmpassword) {
        return res.status(400).json({ error: "Passwords Don't Match" });
    }

    const data = await this.authService.registerUser(name, email, password);
    return res.status(201).json(data);
  } catch (error) {
    console.error('Full error during registration:', error);

    if (error instanceof Error) {
        console.error("Error on registration:", error.message);
        return res.status(500).json({ 
            error: "Registration failed", 
            details: error.message 
        });
    } else {
        console.error("Unknown error occurred during registration:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
  async onVerifyUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const verifiedUser = await this.authService.verifyUser(email);

        if (!verifiedUser) {
            return res.status(404).json({ error: "User not found or already verified" });
        }

        return res.json({ message: "User verified successfully", user: verifiedUser });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Verification error:", error.message);
            return res.status(500).json({ error: "An error occurred during verification" });
        } else {
            console.error("Unknown error during verification:", error);
            next(new Error("Internal Server Error"));
        }
    }
}



async onVerifyOTP(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const isVerified = await this.authService.verifyOTP(email, otp);

    if (!isVerified) {
      return res.status(400).json({ error: "Invalid OTP or OTP expired" });
    }

    return res.json({ message: "OTP verified successfully" });
  } catch (error) {
    next(error);
  }
}

async onResendOTP(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const newOTP = await this.authService.resendOTP(email);

    // Send new OTP via email
    const mailer = new Mailer();
    await mailer.SendEmail(email, `Your new OTP is: ${newOTP}`);

    return res.json({ message: "New OTP sent successfully" });
  } catch (error) {
    next(error);
  }
}

async onLoginUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await this.authService.loginUser(email, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const tokenService = new Token();
    const tokens = tokenService.generateTokens(user._id!);

    // Set tokens in cookies
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        ...userWithoutPassword,
      },
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}

}