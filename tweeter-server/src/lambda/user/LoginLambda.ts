import { LoginRegisterResponse, LoginRequest } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";

export const handler = async (request: LoginRequest): Promise<LoginRegisterResponse> => {
  const userService = new UserService();
  const [user, authToken] = await userService.login(request.alias, request.password);

  return {
    success: true,
    message: null,
    user: user,
    authToken: authToken
  }
}
