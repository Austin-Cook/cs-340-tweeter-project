import { FollowUnfollowResponse, UserActionRequest } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";
import { validateRequest, validateUser } from "../util/ValidateInput";
import { throwBadRequestErrorOnFailure } from "../util/Error";
import { getDaoFactory } from "../../Config";

export const handler = async (request: UserActionRequest): Promise<FollowUnfollowResponse> => {
  return await throwBadRequestErrorOnFailure(async () => {
    validateRequest(request.token, request.user);
    validateUser(request.user);

    const userService = new UserService(getDaoFactory());
    const [followerCount, followeeCount] = await userService.unfollow(request.token, request.user);

    return {
      success: true,
      message: null,
      followeeCount: followeeCount,
      followerCount: followerCount
    }
  },
    "UnfollowLambda"
  );
}
