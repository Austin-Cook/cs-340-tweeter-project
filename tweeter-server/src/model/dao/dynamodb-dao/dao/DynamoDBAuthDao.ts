import { AuthTokenDto, UserDto } from "tweeter-shared";
import { AuthDao } from "../../interface/AuthDao";

export class DynamoDBAuthDao implements AuthDao {
  public async createAuthToken(alias: string): Promise<AuthTokenDto> {
    // TODO
    return {} as AuthTokenDto;
  }

  public async getAuthenticatedUser(token: string): Promise<UserDto> {
    // TODO
    return {} as UserDto;
  }

  public async revokeToken(token: string): Promise<void> {
    // TODO
  }
}
