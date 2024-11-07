import { AuthToken, Status } from "tweeter-shared";
import { ServerFacade } from "../web/ServerFacade";

export class StatusService {
  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return await ServerFacade.instance.loadMoreFeedItems_Server({
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem == null ? null : lastItem.dto
    });
  };

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return await ServerFacade.instance.loadMoreStoryItems_Server({
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem == null ? null : lastItem.dto
    });
  };

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    return await ServerFacade.instance.postStatus_Server({
      token: authToken.token,
      newStatus: newStatus.dto
    })
  };
}
