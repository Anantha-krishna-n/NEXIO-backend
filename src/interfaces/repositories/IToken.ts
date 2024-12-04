export interface IToken {
    generateTokens(userId: string): {
      accessToken: string;
      refreshToken: string;
    };
    verifyAccessToken(token: string): any;
    verifyRefreshToken(token: string): any;
  }