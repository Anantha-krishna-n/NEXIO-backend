export interface User {
    id?: string;
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    verify_token?: string; 
    verified:boolean;
    subscription?:any
  }
  