// TokenMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { Token } from "../../external/Token";

const tokenService = new Token();

export const refreshTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token provided" });
    }

    const payload = tokenService.verifyRefreshToken(refreshToken);
    const { accessToken } = tokenService.generateTokens(payload.userId);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure:true,
      maxAge: 15 * 60 * 1000,
    });
    return next()

    return res.json({ success: true, message: "Access token refreshed" });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ error: "Invalid or expired refresh token" });
  }
};
