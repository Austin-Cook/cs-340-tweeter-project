import { GetFolloweeCountResponse, UserActionRequest } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";
import { throwBadRequestErrorOnFailure } from "../util/Error";
import { validateRequest, validateUser } from "../util/ValidateInput";
import { getDaoFactory } from "../../Config";

export const handler = async (request: UserActionRequest): Promise<GetFolloweeCountResponse> => {
  return await throwBadRequestErrorOnFailure(async () => {
    validateRequest(request.token, request.user);
    validateUser(request.user);

    const userService = new UserService(getDaoFactory());
    const followCount = await userService.getFolloweeCount(request.token, request.user);

    return {
      success: true,
      message: null,
      followeeCount: followCount
    }
  },
    "GetFolloweeCountLambda"
  );
}
