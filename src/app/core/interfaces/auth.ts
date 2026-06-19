export interface LoginRequest {
  Username: string;
  Password:  string;
}

export interface LoginResponse {
  token: string;
}