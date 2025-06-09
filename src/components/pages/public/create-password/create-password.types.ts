export interface CreatePasswordData {
  password: string;
  confirmPassword: string;
}

export interface CreatePasswordState {
  isLoading: boolean;
  error?: string;
}

export interface CreatePasswordResponse {
  success: boolean;
  message?: string;
}
