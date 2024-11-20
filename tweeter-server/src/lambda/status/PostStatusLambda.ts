import { PostStatusRequest } from "tweeter-shared"
import { StatusService } from "../../model/service/StatusService";
import { TweeterResponse } from "tweeter-shared/dist/model/net/response/TweeterResponse";
import { validateRequest, validateStatus } from "../util/ValidateInput";
import { throwBadRequestErrorOnFailure } from "../util/Error";
import { getDaoFactory } from "../../Config";

export const handler = async (request: PostStatusRequest): Promise<TweeterResponse> => {
  return await throwBadRequestErrorOnFailure(async () => {
    validateRequest(request.token, request.newStatus);
    validateStatus(request.newStatus);

    const statusService = new StatusService(getDaoFactory());
    await statusService.postStatus(request.token, request.newStatus);

    return {
      success: true,
      message: null
    }
  },
    "PostStatusLambda"
  );
}
