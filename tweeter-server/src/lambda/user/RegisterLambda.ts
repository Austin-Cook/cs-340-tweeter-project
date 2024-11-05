import { LoginRegisterResponse, RegisterRequest } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";
import { validRequest } from "../util/ValidateInput";
import { getMissingRequestFieldResponse } from "../util/Error";

export const handler = async (request: RegisterRequest): Promise<LoginRegisterResponse> => {
  if (!validRequest(request.firstName, request.lastName, request.alias, request.password, request.userImageBase64, request.imageFileExtension)) {
    return getMissingRequestFieldResponse<LoginRegisterResponse>();
  }
  
  const userService = new UserService();
  const [user, authToken] = await userService.register(request.firstName, request.lastName, request.alias, request.password, request.userImageBase64, request.imageFileExtension);

  return {
    success: true,
    message: null,
    user: user,
    authToken: authToken
  }
}
