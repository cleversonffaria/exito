import type { User } from "@/types/database.types";

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role?: "student" | "teacher";
}
