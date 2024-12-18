export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  profilepic?:string;
  googleId?: string;
  otp?: string | null;
  otpExpires?: Date | null;
  verified:boolean;
  createdAt?:Date;
  subscription?:any
}
