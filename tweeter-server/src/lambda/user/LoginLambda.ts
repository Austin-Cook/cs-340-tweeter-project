import { LoginRegisterResponse, LoginRequest } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";
import { validateRequest } from "../util/ValidateInput";
import { getDaoFactory } from "../../Config";
import { throwBadRequestErrorOnFailure } from "../util/Error";

export const handler = async (request: LoginRequest): Promise<LoginRegisterResponse> => {
  return await throwBadRequestErrorOnFailure(async () => {
    validateRequest(request.alias, request.password)

    const userService = new UserService(getDaoFactory());
    const [user, authToken] = await userService.login(request.alias, request.password);

    return {
      success: true,
      message: null,
      user: user,
      authToken: authToken
    }
  },
    "LoginLambda"
  );
}
