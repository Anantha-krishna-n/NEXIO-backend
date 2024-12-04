import {NextFunction, Request, Response } from "express";
import { IUserAuth } from "../../interfaces/repositories/IUserAuth";
import { User } from "../../entites/User";
import { UserService } from "../../services/UserService";
import { error } from "console";

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
          confirmpassword: !confirmpassword
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

  
async onLoginUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    console.log("email", email);
    console.log("password", password);
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await this.authService.loginUser(email, password);
    return res.json({ success: true, message: "Login successful", user });
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof Error) {
      if (error.message === "User not found" || error.message === "Invalid credentials") {
        return res.status(401).json({ error: error.message });
      }
      return res.status(500).json({ error: "An error occurred during login" });
    } else {
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
}
}