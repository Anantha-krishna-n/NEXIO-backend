import jwt from "jsonwebtoken";
import { IToken } from "../interfaces/repositories/IToken";
import dotenv from "dotenv";

dotenv.config();

export class Token implements IToken {
  private readonly JWT_Key: string = process.env.JWT_SECRET || " ";
  private readonly refreshSecret: string = process.env.REFRESH_TOKEN_SECRET || " ";

  generateTokens(userId: string): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = jwt.sign({ userId }, this.JWT_Key, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId }, this.refreshSecret, {
      expiresIn: "7d",
    });
    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): any {
    return jwt.verify(token, this.JWT_Key);
  }

  verifyRefreshToken(token: string): any {
    return jwt.verify(token, this.refreshSecret);
  }
}
