import { FollowUnfollowResponse, UserActionRequest } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";
import { validateUser, validRequest } from "../util/ValidateInput";
import { getMissingRequestFieldResponse, getMissingUserFieldResponse } from "../util/Error";

export const handler = async (request: UserActionRequest): Promise<FollowUnfollowResponse> => {
  if (!validRequest(request.token, request.user)) {
    return getMissingRequestFieldResponse<FollowUnfollowResponse>();
  }
  if (!validateUser(request.user)) {
    return getMissingUserFieldResponse<FollowUnfollowResponse>();
  }

  const userService = new UserService();
  const [followerCount, followeeCount] = await userService.unfollow(request.token, request.user);

  return {
    success: true,
    message: null,
    followeeCount: followeeCount,
    followerCount: followerCount
  }
}
