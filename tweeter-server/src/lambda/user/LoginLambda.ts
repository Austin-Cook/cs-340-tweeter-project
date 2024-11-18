import { LoginRegisterResponse, LoginRequest } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";
import { validRequest } from "../util/ValidateInput";
import { getMissingRequestFieldResponse, returnErrorResponseOnFailure } from "../util/Error";
import { getDaoFactory } from "../../Config";

export const handler = async (request: LoginRequest): Promise<LoginRegisterResponse> => {
  return await returnErrorResponseOnFailure(async () => {
    if (!validRequest(request.alias, request.password)) {
      return getMissingRequestFieldResponse<LoginRegisterResponse>();
    }

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
