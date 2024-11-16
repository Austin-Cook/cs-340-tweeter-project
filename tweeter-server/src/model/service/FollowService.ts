import { UserDto } from "tweeter-shared";
import { AuthService } from "./AuthService";
import { DaoFactory } from "../dao/factory/DaoFactory";
import { FollowDao } from "../dao/interface/FollowDao";

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
    await this._authService.renewAuthTokenTimestamp(token);

    return this._followDao.loadMoreFollowers(userAlias, pageSize, lastItem === null ? undefined : lastItem);
  };

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this._authService.renewAuthTokenTimestamp(token);

    return this._followDao.loadMoreFollowers(userAlias, pageSize, lastItem === null ? undefined : lastItem);
  };
}
