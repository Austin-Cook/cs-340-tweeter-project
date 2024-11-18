import { UserDto } from "tweeter-shared";
import { AuthService } from "./AuthService";
import { DaoFactory } from "../dao/factory/DaoFactory";
import { FollowDao } from "../dao/interface/FollowDao";
import { doFailureReportingOperation } from "../util/FailureReportingOperation";

export class FollowService {
  private readonly _followDao: FollowDao;
  private readonly _authService: AuthService;

  constructor(daoFactory: DaoFactory) {
    this._followDao = daoFactory.createFollowDao();
    this._authService = new AuthService(daoFactory);
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return await doFailureReportingOperation(async () => {
      await this._authService.renewAuthTokenTimestamp(token);

      return this._followDao.loadMoreFollowers(userAlias, pageSize, lastItem === null ? undefined : lastItem);
    },
      "FollowService",
      "loadMoreFollowers"
    );
  };

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return await doFailureReportingOperation(async () => {
      await this._authService.renewAuthTokenTimestamp(token);

      return this._followDao.loadMoreFollowees(userAlias, pageSize, lastItem === null ? undefined : lastItem);
    },
      "FollowService",
      "loadMoreFollowees"
    );
  };
}
