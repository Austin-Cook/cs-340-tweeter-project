import { AuthToken, AuthTokenDto, UserDto } from "tweeter-shared";
import { DaoFactory } from "../dao/factory/DaoFactory";
import { AuthDao } from "../dao/interface/AuthDao";
import { UserDao } from "../dao/interface/UserDao";
import { doFailureReportingOperation } from "../util/FailureReportingOperation";

export class AuthService {
  private _userDao: UserDao;
  private _authDao: AuthDao;

  // in milliseconds
  readonly _timestampDuration = 3600000; // 1 hour

  constructor(daoFactory: DaoFactory) {
    this._userDao = daoFactory.createUserDao();
    this._authDao = daoFactory.createAuthDao();
  }

  /**
   * Authenticates the user, creates a new authtoken, and returns it
   */
  public async createAuthToken(user: UserDto, password: string): Promise<AuthTokenDto> {
    return await doFailureReportingOperation(async () => {
      // authenticate password
      const expected = await this._userDao.getSavedPasswordHash(user.alias);
      const actual = this.hashPassword(password, user.alias);
      if (expected !== actual) {
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
   * Checks if token is valid and matches the user alias
   * 
   * Throws an error on failed authentication
   */
  public async verifyAuthenticatedUser(token: string, alias: string): Promise<void> {
    await doFailureReportingOperation(async () => {
      const [actualUser, timestamp] = await this._authDao.getAuthenticatedUser(token);
      if (alias !== actualUser.alias) {
        throw new Error("Alias doesn't match the alias of the user associated with the token");
      }

      if (!this.isTimestampValid(timestamp)) {
        throw new Error(`Token has expired. Current token lifespan is ${this._timestampDuration} milliseconds.`)
      }
    },
      "AuthService",
      "verifyAuthenticatedUser"
    );
  }

  public async getAuthenticatedUser(token: string): Promise<UserDto> {
    // TODO
    return {} as any;
  }

  /**
   * Note - We use the alias as salt because it is unique. While a random salt would ideally be
   * generated and stored for each user, this method is a compromise due to time constraints.
   */
  private hashPassword(password: string, alias: string): string {
    const saltedPassword = password + alias;
    // TODO
    throw new Error("Need to implement hashPassword");
    return "TODO NOT YET IMPLEMENTED";
  }

  /**
   * Timestamp is valid for as many milliseconds as specified in this._timestampDuration
   */
  private isTimestampValid(timestamp: number): boolean {
    return Date.now() - timestamp <= this._timestampDuration;
  }
}
