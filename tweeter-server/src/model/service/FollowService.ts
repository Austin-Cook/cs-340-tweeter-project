import { UserDto } from "tweeter-shared";
import { AuthService } from "./AuthService";
import { IDaoFactory } from "../dao/factory/IDaoFactory";
import { IFollowDao } from "../dao/interface/IFollowDao";
import { doFailureReportingOperation } from "../util/FailureReportingOperation";

export class FollowService {
  private readonly _followDao: IFollowDao;
  private readonly _authService: AuthService;

  constructor(daoFactory: IDaoFactory) {
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
