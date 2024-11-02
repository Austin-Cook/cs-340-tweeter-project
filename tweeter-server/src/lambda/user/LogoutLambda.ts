import { LogoutRequest } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";
import { TweeterResponse } from "tweeter-shared/dist/model/net/response/TweeterResponse";

export const handler = async (request: LogoutRequest): Promise<TweeterResponse> => {
  const userService = new UserService();
  await userService.logout(request.token);

  return {
    success: true,
    message: null
  }
}
