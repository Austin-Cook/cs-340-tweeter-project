import { GetUserRequest, GetUserResponse } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";
import { validateRequest } from "../util/ValidateInput";
import { throwBadRequestErrorOnFailure } from "../util/Error";
import { getDaoFactory } from "../../Config";

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
  return await throwBadRequestErrorOnFailure(async () => {
    validateRequest(request.token, request.alias);

    const userService = new UserService(getDaoFactory());
    const user = await userService.getUser(request.token, request.alias);

    return {
      success: true,
      message: null,
      user: user
    }
  },
    "GetUserLambda"
  );
}
