import { GetFollowerCountResponse, UserActionRequest } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";
import { validateRequest, validateUser } from "../util/ValidateInput";
import { throwBadRequestErrorOnFailure } from "../util/Error";
import { getDaoFactory } from "../../Config";

export const handler = async (request: UserActionRequest): Promise<GetFollowerCountResponse> => {
  return await throwBadRequestErrorOnFailure(async () => {
    validateRequest(request.token, request.user);
    validateUser(request.user);

    const userService = new UserService(getDaoFactory());
    const followCount = await userService.getFollowerCount(request.token, request.user);

    return {
      success: true,
      message: null,
      followerCount: followCount
    }
  },
    "GetFollowerCountLambda"
  );
}
