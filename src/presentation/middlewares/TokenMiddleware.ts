import { Request, Response, NextFunction } from "express";
import { Token } from "../../external/Token";

const tokenService = new Token();

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

export const refreshTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accessToken, refreshToken } = req.cookies;
console.log(accessToken,"accessToken")
console.log(refreshToken,"refreshToken")
    if (!refreshToken && !accessToken) {
      return res.status(401).json({ error: "Please log in again" });
    }

    
    if (accessToken) {
      try {
        const payload = tokenService.verifyAccessToken(accessToken);
        if (payload.userId) {
          req.userId = payload.userId
          return next(); 
        }
      } catch (err) {
        console.log("Invalid access token. Checking refresh token...");
      }
    }
 
  
    if (refreshToken) {
      try {
        const payload = tokenService.verifyRefreshToken(refreshToken);
        console.log(payload.userId, "user");

        if (payload.userId) {
          // Generate new tokens
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            tokenService.generateTokens(payload.userId);

          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 15 * 60 * 1000, 
          });
     
          res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });

          req.userId = payload.userId
          return next(); 
        }
      } catch (error) {
        console.error("Refresh token validation error:", error);
        return res
          .status(401)
          .json({ error: "Invalid or expired refresh token. Please log in again" });
      }
    }

    // If both tokens fail
    return res
      .status(401)
      .json({ error: "Invalid token. Please log in again" });
  } catch (error) {
    console.error("Unexpected error in refreshTokenHandler:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
