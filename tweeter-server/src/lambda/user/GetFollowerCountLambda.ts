import { GetFollowerCountResponse, UserActionRequest } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";
import { validateUser, validRequest } from "../util/ValidateInput";
import { getMissingRequestFieldResponse, getMissingUserFieldResponse } from "../util/Error";

export const handler = async (request: UserActionRequest): Promise<GetFollowerCountResponse> => {
  if (!validRequest(request.token, request.user)) {
    return getMissingRequestFieldResponse<GetFollowerCountResponse>();
  }
  if (!validateUser(request.user)) {
    return getMissingUserFieldResponse<GetFollowerCountResponse>();
  }

  const userService = new UserService();
  const followCount = await userService.getFollowerCount(request.token, request.user);

  return {
    success: true,
    message: null,
    followerCount: followCount
  }
}
