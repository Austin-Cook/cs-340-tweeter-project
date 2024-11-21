import { Buffer } from "buffer";
import { AuthTokenDto, UserDto } from "tweeter-shared";
import { AuthService } from "./AuthService";
import { IUserDao } from "../dao/interface/IUserDao";
import { IDaoFactory } from "../dao/factory/IDaoFactory";
import { doFailureReportingOperation } from "../util/FailureReportingOperation";
import { IAuthDao } from "../dao/interface/IAuthDao";
import { IImageDao } from "../dao/interface/IImageDao";
import { IFollowDao } from "../dao/interface/IFollowDao";

export class UserService {
  private readonly _userDao: IUserDao;
  private readonly _imageDao: IImageDao;
  private readonly _authDao: IAuthDao;
  private readonly _followDao: IFollowDao;
  private readonly _authService: AuthService;

  constructor(daoFactory: IDaoFactory) {
    this._userDao = daoFactory.createUserDao();
    this._imageDao = daoFactory.createImageDao();
    this._authDao = daoFactory.createAuthDao();
    this._followDao = daoFactory.createFollowDao();
    this._authService = new AuthService(daoFactory);
  }

  public async getUser(
    token: string,
    alias: string
  ): Promise<UserDto | null> {
    return await doFailureReportingOperation(async () => {
      await this._authService.renewAuthTokenTimestamp(token);

      return this._userDao.getUser(alias);
    },
      "UserService",
      "getUser"
    );
  };

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    return await doFailureReportingOperation(async () => {
      // get the user
      const user: UserDto | null = await this._userDao.getUser(alias);
      if (user == null) {
        throw new Error(`User with alias: '${alias}' does not exist`);
      }

      // authenticate password
      // generate authToken and save it to db
      const authToken: AuthTokenDto = await this._authService.createAuthToken(user, password);

      return [user, authToken];
    },
      "UserService",
      "login"
    );
  };

  public async logout(token: string): Promise<void> {
    await doFailureReportingOperation(async () => {
      await this._authDao.revokeToken(token);
    },
      "UserService",
      "logout"
    );
  };

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBase64: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    return await doFailureReportingOperation(async () => {
      // originally converted to base64 with const imageStringBase64: string
      // = Buffer.from(userImageBytes).toString("base64");
      const decodedImageBuffer: Buffer = Buffer.from(userImageBase64, "base64");

      const imageUrl: string = await this._imageDao.uploadImage(alias, imageFileExtension, decodedImageBuffer);

      const user: UserDto = {
        firstName: firstName,
        lastName: lastName,
        alias: alias,
        imageUrl: imageUrl
      }
      const passwordHash: string = this._authService.hashPassword(password, alias);

      await this._userDao.createUser(user, passwordHash);

      const authToken = await this._authService.createAuthToken(user, password);

      return [user, authToken];
    },
      "UserService",
      "register"
    );
  };

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    return await doFailureReportingOperation(async () => {
      await this._authService.renewAuthTokenTimestamp(token);

      return this._followDao.isFollower(user.alias, selectedUser.alias);
    },
      "UserService",
      "getIsFollowerStatus"
    );
  };

  public async getFolloweeCount(
    token: string,
    user: UserDto
  ): Promise<number> {
    return await doFailureReportingOperation(async () => {
      await this._authService.renewAuthTokenTimestamp(token);

      const [followerCount, followeeCount] = await this._userDao.getFollowCounts(user.alias);
      return followeeCount;
    },
      "UserService",
      "getFolloweeCount"
    );
  };

  public async getFollowerCount(
    token: string,
    user: UserDto
  ): Promise<number> {
    return await doFailureReportingOperation(async () => {
      await this._authService.renewAuthTokenTimestamp(token);

      const [followerCount, followeeCount] = await this._userDao.getFollowCounts(user.alias);

      return followerCount;
    },
      "UserService",
      "getFollowerCount"
    );
  };

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    return await doFailureReportingOperation(async () => {
      await this._authService.renewAuthTokenTimestamp(token);

      const follower = await this._authService.getUserFromToken(token);
      if (follower.alias == userToFollow.alias) {
        throw new Error("A user can't follow themself")
      }

      await this._followDao.createFollow(follower, userToFollow);
      await this._userDao.incrementNumFollowees(follower.alias);
      await this._userDao.incrementNumFollowers(userToFollow.alias);

      const followerCount = await this.getFollowerCount(token, userToFollow);
      const followeeCount = await this.getFolloweeCount(token, userToFollow);

      return [followerCount, followeeCount];
    },
      "UserService",
      "follow"
    );
  };

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    return await doFailureReportingOperation(async () => {
      await this._authService.renewAuthTokenTimestamp(token);

      const follower = await this._authService.getUserFromToken(token);
      if (follower.alias == userToUnfollow.alias) {
        throw new Error("A user can't unfollow themself")
      }

      await this._followDao.removeFollow(follower.alias, userToUnfollow.alias);
      await this._userDao.decrementNumFollowees(follower.alias);
      await this._userDao.decrementNumFollowers(userToUnfollow.alias);

      const followerCount = await this.getFollowerCount(token, userToUnfollow);
      const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

      return [followerCount, followeeCount];
    },
      "UserService",
      "unfollow"
    );
  };
}
