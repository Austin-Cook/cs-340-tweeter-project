import { LoginRegisterResponse, LoginRequest } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";
import { validRequest } from "../util/ValidateInput";
import { getMissingRequestFieldResponse } from "../util/Error";

export const handler = async (request: LoginRequest): Promise<LoginRegisterResponse> => {
  if (!validRequest(request.alias, request.password)) {
    return getMissingRequestFieldResponse<LoginRegisterResponse>();
  }

  const userService = new UserService();
  const [user, authToken] = await userService.login(request.alias, request.password);

  return {
    success: true,
    message: null,
    user: user,
    authToken: authToken
  }
}
