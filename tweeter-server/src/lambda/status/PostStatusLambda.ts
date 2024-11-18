import { PostStatusRequest } from "tweeter-shared"
import { StatusService } from "../../model/service/StatusService";
import { TweeterResponse } from "tweeter-shared/dist/model/net/response/TweeterResponse";
import { validateStatus, validRequest } from "../util/ValidateInput";
import { getMissingRequestFieldResponse, getMissingStatusFieldResponse } from "../util/Error";
import { getDaoFactory } from "../../Config";

export const handler = async (request: PostStatusRequest): Promise<TweeterResponse> => {
  if (!validRequest(request.token, request.newStatus)) {
    return getMissingRequestFieldResponse<TweeterResponse>();
  }
  if (!validateStatus(request.newStatus)) {
    return getMissingStatusFieldResponse<TweeterResponse>();
  }

  const statusService = new StatusService(getDaoFactory());
  await statusService.postStatus(request.token, request.newStatus);

  return {
    success: true,
    message: null
  }
}
