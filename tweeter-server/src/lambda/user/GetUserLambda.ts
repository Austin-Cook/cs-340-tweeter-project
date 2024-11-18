import { GetUserRequest, GetUserResponse } from "tweeter-shared"
import { UserService } from "../../model/service/UserService";
import { validRequest } from "../util/ValidateInput";
import { getMissingRequestFieldResponse, returnErrorResponseOnFailure } from "../util/Error";
import { getDaoFactory } from "../../Config";

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
  return await returnErrorResponseOnFailure(async () => {
    if (!validRequest(request.token, request.alias)) {
      return getMissingRequestFieldResponse<GetUserResponse>();
    }
  
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
