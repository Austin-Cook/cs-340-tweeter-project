import { StatusService } from "../../model/service/StatusService";
import { validateRequest, validateStatus } from "../util/ValidateInput";
import { getDaoFactory } from "../../Config";
import { PostUpdateFeedRequest } from "tweeter-shared";

export const handler = async (event: any): Promise<void> => {
  for (let i = 0; i < event.Records.length; ++i) {
    // extract record
    const { body } = event.Records[i];
    const request: PostUpdateFeedRequest = JSON.parse(body)

    // validation
    validateRequest(request.newStatus);
    validateStatus(request.newStatus);

    const statusService = new StatusService(getDaoFactory());
    await statusService.addStatusToUpdateFeedQueueInGroupsOfFollowers(request.newStatus);
  }
};
