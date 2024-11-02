import { FollowUnfollowResponse, UserActionRequest } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";

export const handler = async (request: UserActionRequest): Promise<FollowUnfollowResponse> => {
  const userService = new UserService();
  const [followerCount, followeeCount] = await userService.unfollow(request.token, request.user);

  return {
    success: true,
    message: null,
    followeeCount: followeeCount,
    followerCount: followerCount
  }
}
