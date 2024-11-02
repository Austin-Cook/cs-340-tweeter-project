import { GetFolloweeCountResponse, UserActionRequest } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";

export const handler = async (request: UserActionRequest): Promise<GetFolloweeCountResponse> => {
  const userService = new UserService();
  const followCount = await userService.getFolloweeCount(request.token, request.user);

  return {
    success: true,
    message: null,
    followeeCount: followCount
  }
}
