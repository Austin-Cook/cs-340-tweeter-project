import { GetIsFollowerStatusRequest, GetIsFollowerStatusResponse } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";
import { validateRequest, validateUser } from "../util/ValidateInput";
import { throwBadRequestErrorOnFailure } from "../util/Error";
import { getDaoFactory } from "../../Config";

export const handler = async (request: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> => {
  return await throwBadRequestErrorOnFailure(async () => {
    validateRequest(request.token, request.user, request.selectedUser);
    validateUser(request.user);
    validateUser(request.selectedUser);

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
