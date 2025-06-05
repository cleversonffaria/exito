export interface FirstAccessData {
  email: string;
}

export interface FirstAccessState {
  isLoading: boolean;
  error?: string;
}

export interface FirstAccessResponse {
  success: boolean;
  message?: string;
}
