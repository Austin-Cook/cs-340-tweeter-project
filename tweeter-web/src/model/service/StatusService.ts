import { AuthToken, Status } from "tweeter-shared";
import { ServerFacade } from "../web/ServerFacade";

export class StatusService {
  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return ServerFacade.instance.loadMoreFeedItems_Server({
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
    console.log("\n\nStory request:")
    console.log({
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem == null ? null : lastItem.dto
    })
    console.log()
    return ServerFacade.instance.loadMoreStoryItems_Server({
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
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  };
}
