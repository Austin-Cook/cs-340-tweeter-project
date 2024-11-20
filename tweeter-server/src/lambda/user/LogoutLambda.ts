import { LogoutRequest } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";
import { TweeterResponse } from "tweeter-shared/dist/model/net/response/TweeterResponse";
import { validateRequest } from "../util/ValidateInput";
import { throwBadRequestErrorOnFailure } from "../util/Error";
import { getDaoFactory } from "../../Config";

export const handler = async (request: LogoutRequest): Promise<TweeterResponse> => {
  return await throwBadRequestErrorOnFailure(async () => {
    validateRequest(request.token);

    const userService = new UserService(getDaoFactory());
    await userService.logout(request.token);

    return {
      success: true,
      message: null
    }
  },
    "LogoutLambda"
  );
}
