import ApiResponse from "../utils/apiRespone";

export interface IAuthService {
  // signInWithGoogle(token: string): Promise<ApiResponse>;  // OAuth disabled
  signup(username: string, password: string): Promise<ApiResponse>;
  login(username: string, password: string): Promise<ApiResponse>;
}