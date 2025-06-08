export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginState {
  isLoading: boolean;
  error?: string;
}

export interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  token?: string;
}
