export interface ValidateCodeData {
  code: string;
}

export interface ValidateCodeState {
  isLoading: boolean;
  error?: string;
}

export interface ValidateCodeResponse {
  success: boolean;
  message?: string;
}
