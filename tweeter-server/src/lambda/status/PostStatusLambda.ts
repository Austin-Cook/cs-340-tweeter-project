import { PostStatusRequest } from "tweeter-shared"
import { TweeterResponse } from "tweeter-shared/dist/model/net/response/TweeterResponse";
import { validateRequest, validateStatus } from "../util/ValidateInput";
import { throwBadRequestErrorOnFailure } from "../util/Error";
import { StatusService } from "../../model/service/StatusService";
import { getDaoFactory } from "../../Config";

export const handler = async (request: PostStatusRequest): Promise<TweeterResponse> => {
  return await throwBadRequestErrorOnFailure(async () => {
    validateRequest(request.token, request.newStatus);
    validateStatus(request.newStatus);

    const statusService = new StatusService(getDaoFactory());
    const promises: Promise<any>[] = [
      statusService.postStatusToStory(request.token, request.newStatus),
      statusService.addStatusToPostQueue(request.newStatus)
    ]

    await Promise.all(promises);

    return {
      success: true,
      message: null
    }
  },
    "PostStatusLambda"
  );
}
