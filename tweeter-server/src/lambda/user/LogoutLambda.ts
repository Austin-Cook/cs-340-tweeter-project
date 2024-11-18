import { LogoutRequest } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";
import { TweeterResponse } from "tweeter-shared/dist/model/net/response/TweeterResponse";
import { validRequest } from "../util/ValidateInput";
import { getMissingRequestFieldResponse, returnErrorResponseOnFailure } from "../util/Error";
import { getDaoFactory } from "../../Config";

export const handler = async (request: LogoutRequest): Promise<TweeterResponse> => {
  return await returnErrorResponseOnFailure(async () => {
    if (!validRequest(request.token)) {
      return getMissingRequestFieldResponse<TweeterResponse>();
    }
  
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
