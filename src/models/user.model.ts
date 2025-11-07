export interface User {
  id: string;
  email: string;
  password: string;
  name?: string | null;
  isVerified: boolean;
  isActive: boolean;
  verificationToken?: string | null;
  resetToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
