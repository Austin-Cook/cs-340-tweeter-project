import { GetIsFollowerStatusRequest, GetIsFollowerStatusResponse } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";
import { validateUser, validRequest } from "../util/ValidateInput";
import { getMissingRequestFieldResponse, getMissingUserFieldResponse, returnErrorResponseOnFailure } from "../util/Error";
import { getDaoFactory } from "../../Config";

export const handler = async (request: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> => {
  return await returnErrorResponseOnFailure(async () => {
    if (!validRequest(request.token, request.user, request.selectedUser)) {
      return getMissingRequestFieldResponse<GetIsFollowerStatusResponse>();
    }
    if (!validateUser(request.user) || !validateUser(request.selectedUser)) {
      return getMissingUserFieldResponse<GetIsFollowerStatusResponse>();
    }
  
    const userService = new UserService(getDaoFactory());
    const isFollower = await userService.getIsFollowerStatus(request.token, request.user, request.selectedUser);
  
    return {
      success: true,
      message: null,
      isFollower: isFollower
    }
  },
    "GetIsFollowerStatusLambda"
  );
}
