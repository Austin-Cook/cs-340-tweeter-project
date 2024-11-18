import { StatusDto } from "tweeter-shared";
import { StatusDao } from "../dao/interface/StatusDao";
import { AuthService } from "./AuthService";
import { DaoFactory } from "../dao/factory/DaoFactory";
import { doFailureReportingOperation } from "../util/FailureReportingOperation";
import { FollowDao } from "../dao/interface/FollowDao";

export class StatusService {
  private readonly _statusDao: StatusDao;
  private readonly _followDao: FollowDao;
  private readonly _authService: AuthService;

  constructor(daoFactory: DaoFactory) {
    this._statusDao = daoFactory.createStatusDao();
    this._followDao = daoFactory.createFollowDao();
    this._authService = new AuthService(daoFactory);
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return await doFailureReportingOperation(async () => {
      await this._authService.verifyActiveUser(token);
      await this._authService.renewAuthTokenTimestamp(token);

      return this._statusDao.loadMoreFeedItems(userAlias, pageSize, lastItem === null ? undefined : lastItem);
    },
      "StatusService",
      "loadMoreFeedItems"
    );
  };

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return await doFailureReportingOperation(async () => {
      await this._authService.renewAuthTokenTimestamp(token);

      return this._statusDao.loadMoreStoryItems(userAlias, pageSize, lastItem === null ? undefined : lastItem);
    },
      "StatusService",
      "loadMoreStoryItems"
    );
  };

  public async postStatus(
    token: string,
    newStatus: StatusDto
  ): Promise<void> {
    await doFailureReportingOperation(async () => {
      await this._authService.verifyAuthenticatedUser(token, newStatus.user.alias);
      await this._authService.renewAuthTokenTimestamp(token);

      // add post to each follower's feed
      const followerAliases: string[] = await this._followDao.getAllFollowerAliases(newStatus.user.alias);
      await this._statusDao.addStatusesToUsersFeed(followerAliases, newStatus);

      await this._statusDao.postStatus(newStatus);
    },
      "statusService",
      "postStatus"
    );
  };
}
