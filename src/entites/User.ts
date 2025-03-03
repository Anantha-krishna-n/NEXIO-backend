export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  profilepic?: string;
  googleId?: string;
  otp?: string | null;
  otpExpires?: Date | null;
  verified: boolean;
  isBlocked?: boolean;
  createdAt?: Date;
  subscription?: {
    isActive: boolean;
    startDate: Date;
    endDate: Date;
    plan: 'free' | 'gold' | 'platinum';
    availableClassroom?: {
      public: number;
      private: number;
    };
  }
  publicClassroomCount?: number;
  privateClassroomCount?: number;
}
