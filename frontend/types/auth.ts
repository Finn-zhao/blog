export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  username: string;
  nickname: string;
  email: string;
}

export interface LoginResponse {
  code: number;
  message: string;
  data: LoginResponseData;
}