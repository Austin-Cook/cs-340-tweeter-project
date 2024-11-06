import { AuthToken, FakeData, User } from "tweeter-shared";
import { ServerFacade } from "../web/ServerFacade";

export class FollowService {
  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    return await ServerFacade.instance.loadMoreFollowers_Server({
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem == null ? null : lastItem.dto
    });
  };

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    return await ServerFacade.instance.loadMoreFollowees_Server({
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem == null ? null : lastItem.dto
    });
  };
}
