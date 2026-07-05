export type UserRole = "Buyer" | "Crafter" | "Admin";
export type UserStatus = "Active" | "Suspended" | "Inactive";

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  dateJoined: string;
  status: UserStatus;
  lastActive: string;   
  avatar?: string;
}
