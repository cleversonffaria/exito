export interface ValidateCodeData {
  code: string;
}

export interface ValidateCodeResponse {
  success: boolean;
  message?: string;
}
