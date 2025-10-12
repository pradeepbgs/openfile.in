import { oAuthClient } from "../../config/oauth";
import { UserDTO } from "../../dto/user.dto";
import { IAuthService } from "../../interface/auth.interface";
import { INotification } from "../../interface/notification.interface";
import { IUserRepository } from "../../interface/user.interface";
import { ApiError } from "../../utils/apiError";
import ApiResponse from "../../utils/apiRespone";
import { generateAccessAndRefreshToken } from "../../utils/generate.token";


export class DieselAuthService implements IAuthService {

      private static instance: DieselAuthService
      private notificationService: INotification
      private userRepository: IUserRepository
    
      constructor(notificationService: INotification, userRepository: IUserRepository) {
        this.notificationService = notificationService
        this.userRepository = userRepository
      }
    
      static getInstance(notificationService:INotification,userRepository: IUserRepository) {
        if (!DieselAuthService.instance) {
          DieselAuthService.instance = new DieselAuthService(notificationService, userRepository)
        }
        return DieselAuthService.instance;
      }


    signInWithGoogle = async (token: string): Promise<ApiResponse> => {
        const ticket = await oAuthClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        if (!ticket) throw new ApiError("Invalid id_token", 401);

        const payload = ticket.getPayload();
        if (!payload || !payload?.email) throw new ApiError("Invalid id_token", 401);

        const { email, name, picture } = payload;

        let user = await this.userRepository.findUserByEmail(email);
        if (!user) {
            user = await this.userRepository.createUser(name, email, picture) as any
            if (!user) throw new ApiError("Something went wrong while creating user", 500)
            this.notificationService.sendWelcomeEmail(email);
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user);
        const userDTO = new UserDTO(user);

        return new ApiResponse(201, "Login successful", { user: userDTO, accessToken, refreshToken })
    }
}