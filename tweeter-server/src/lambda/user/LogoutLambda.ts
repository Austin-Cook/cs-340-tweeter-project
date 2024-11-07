import { LogoutRequest } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";
import { TweeterResponse } from "tweeter-shared/dist/model/net/response/TweeterResponse";
import { validRequest } from "../util/ValidateInput";
import { getMissingRequestFieldResponse } from "../util/Error";

export const handler = async (request: LogoutRequest): Promise<TweeterResponse> => {
  if (!validRequest(request.token)) {
    return getMissingRequestFieldResponse<TweeterResponse>();
  }

  const userService = new UserService();
  await userService.logout(request.token);

  return {
    success: true,
    message: null
  }
}
