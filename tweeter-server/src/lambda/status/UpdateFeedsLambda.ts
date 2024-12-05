import { UpdateFeedRequest } from "tweeter-shared"
import { StatusService } from "../../model/service/StatusService";
import { validateRequest, validateStatus } from "../util/ValidateInput";
import { getDaoFactory } from "../../Config";

export const handler = async (event: any) => {
  for (let i = 0; i < event.Records.length; ++i) {
    const startTimeMillis = new Date().getTime();

    // extract record
    const { body } = event.Records[i];
    const request: UpdateFeedRequest = JSON.parse(body)

    // validation
    validateRequest(request.newStatus);
    validateStatus(request.newStatus);

    // post status to feeds
    const statusService = new StatusService(getDaoFactory());
    await statusService.postStatusToFeeds(request.followerAliases, request.newStatus)

    const elapsedTime = new Date().getTime() - startTimeMillis;
    if (elapsedTime < 1000) {
      await new Promise<void>((resolve) => setTimeout(resolve, 1000 - elapsedTime));
    }
  }
};
