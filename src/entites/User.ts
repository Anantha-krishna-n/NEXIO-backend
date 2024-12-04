export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  verificationToken?: string; 
  verified:boolean;
  subscription?:any
}