export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  otp?: string | null;
  otpExpires?: Date | null;
  verified:boolean;
  subscription?:any
}