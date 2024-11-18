import { GetFolloweeCountResponse, UserActionRequest } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";
import { getMissingRequestFieldResponse, getMissingUserFieldResponse } from "../util/Error";
import { validateUser, validRequest } from "../util/ValidateInput";
import { getDaoFactory } from "../../Config";

export const handler = async (request: UserActionRequest): Promise<GetFolloweeCountResponse> => {
  if (!validRequest(request.token, request.user)) {
    return getMissingRequestFieldResponse<GetFolloweeCountResponse>();
  }
  if (!validateUser(request.user)) {
    return getMissingUserFieldResponse<GetFolloweeCountResponse>();
  }

  const userService = new UserService(getDaoFactory());
  const followCount = await userService.getFolloweeCount(request.token, request.user);

  return {
    success: true,
    message: null,
    followeeCount: followCount
  }
}
