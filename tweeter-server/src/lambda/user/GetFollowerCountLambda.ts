import { GetFollowCountResponse, UserActionRequest } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";

export const handler = async (request: UserActionRequest): Promise<GetFollowCountResponse> => {
  const userService = new UserService();
  const followCount = await userService.getFollowerCount(request.token, request.user);

  return {
    success: true,
    message: null,
    followCount: followCount
  }
}
