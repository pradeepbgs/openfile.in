import ApiResponse from "../utils/apiRespone";

export interface IAuthService {
  signInWithGoogle(token: string): Promise<ApiResponse>;
}