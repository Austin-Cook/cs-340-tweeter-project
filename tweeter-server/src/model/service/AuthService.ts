import { AuthToken, AuthTokenDto, UserDto } from "tweeter-shared";
import { IDaoFactory } from "../dao/factory/IDaoFactory";
import { IAuthDao } from "../dao/interface/IAuthDao";
import { IUserDao } from "../dao/interface/IUserDao";
import { doFailureReportingOperation, doFailureReportingOperation_Sync } from "../util/FailureReportingOperation";
import { compareSync, hashSync } from "bcryptjs";

export class AuthService {
  private readonly _userDao: IUserDao;
  private readonly _authDao: IAuthDao;

  constructor(daoFactory: IDaoFactory) {
    this._userDao = daoFactory.createUserDao();
    this._authDao = daoFactory.createAuthDao();
  }

  /**
   * Authenticates the user, creates a new authtoken, and returns it
   * 
   * NOTE - For register, if I run into issues creating an AuthToken, it could be
   * because of a race condition where the password hash hasn't been saved yet.
   */
  public async createAuthToken(user: UserDto, password: string): Promise<AuthTokenDto> {
    return await doFailureReportingOperation(async () => {
      // authenticate password
      const savedPasswordHash = await this._userDao.getSavedPasswordHash(user.alias);
      if (!this.isHashMatch(password, user.alias, savedPasswordHash)) {
        throw new Error("Incorrect password");
      }

      // generate authToken and save to DB
      const authToken: AuthTokenDto = AuthToken.Generate().dto;
      await this._authDao.createAuthToken(authToken, user);

      return authToken;
    },
      "AuthService",
      "createAuthToken"
    );
  }

  /**
   * Note: This will only renew a timestamp if it is not yet expired.
   * HOWEVER, it is expired, it doesn't throw an error, because this function is not meant 
   * to be used for authentication, AND some service methods that call this don't require
   * authentication (loadMoreFollowers/loadMoreFollowees for example)
   * */
  public async renewAuthTokenTimestamp(token: string): Promise<boolean> {
    return await doFailureReportingOperation(async () => {
      if (!(await this.isAuthTokenActive(token))) {
        // don't update if authToken is expired
        return false;
      }

      const newTimestamp: number = AuthToken.getNewExpireTime();

      await this._authDao.renewAuthToken(token, newTimestamp);

      return true;
    },
      "AuthService",
      "renewAuthTokenTimestamp"
    )
  }

  /**
   * Checks if token is valid and matches the user alias
   * 
   * Throws an error on failed authentication
   */
  public async verifyAuthenticatedUser(token: string, alias: string): Promise<void> {
    await doFailureReportingOperation(async () => {
      const [actualUser, timestamp] = await this._authDao.getUser(token);
      if (alias !== actualUser.alias) {
        throw new Error("Alias doesn't match the alias of the user associated with the token");
      }

      this.assertNotTimedOut(timestamp);
    },
      "AuthService",
      "verifyAuthenticatedUser"
    );
  }

  /**
   * Throws an error if the token isn't active
   */
  public async verifyActiveUser(token: string): Promise<void> {
    return await doFailureReportingOperation(async () => {
      const timestamp: number | null = await this._authDao.getTimestamp_Soft(token);
      if (timestamp == null) {
        throw new Error("AuthToken doesn't exist");
      }

      this.assertNotTimedOut(timestamp);
    },
      "AuthService",
      "verifyActiveUser"
    );
  }

  public async getUserFromToken(token: string): Promise<UserDto> {
    return await doFailureReportingOperation(async () => {
      const [user, timestamp] = await this._authDao.getUser(token);

      this.assertNotTimedOut(timestamp);

      return user;
    },
      "AuthService",
      "getUserFromToken"
    );
  }

  /**
 * Note - I use the alias as salt because it is unique. While a random salt would ideally be
 * generated and stored for each user, this method is a compromise due to time constraints.
 * Note - I also don't use bcrypts salting functionality, appending the alias to the password
 * is simply a workaround.
 */
  public hashPassword(password: string, alias: string): string {
    return doFailureReportingOperation_Sync(() => {
      const saltedPassword = password + alias;

      return hashSync(saltedPassword);
    },
      "AuthService",
      "hashPassword"
    );
  }

  public async isAuthTokenActive(token: string): Promise<boolean> {
    return doFailureReportingOperation(async () => {
      const timestamp: number | null = await this._authDao.getTimestamp_Soft(token);
      if (timestamp == null) {
        return false;
      }

      return this.isTimestampActive(timestamp);
    },
      "AuthService",
      "isAuthTokenActive"
    );
  }

  /**
   * Note - bcrypt.js doesn't compare the hash char by char. Rather, it mathematically
   * checks if our salted password is compatible with the storedHash.
   */
  private isHashMatch(password: string, alias: string, storedHash: string): boolean {
    return doFailureReportingOperation_Sync(() => {
      const saltedPassword = password + alias;

      return compareSync(saltedPassword, storedHash);
    },
      "AuthService",
      "isHashMatch"
    );
  }

  /**
   * Timestamp should specify expiration time
   */
  private isTimestampActive(timestamp: number): boolean {
    return AuthToken.getCurrentTime_seconds() < timestamp;
  }

  /**
   * Throws an error if the timestamp is expired
   */
  private assertNotTimedOut(timestamp: number): void {
    if (!this.isTimestampActive(timestamp)) {
      throw new Error(`Token has expired. Current token lifespan is ${AuthToken.ttl} seconds.`)
    }
  }
}
