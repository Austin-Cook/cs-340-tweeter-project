import { UserDto } from "tweeter-shared";
import { UserDao } from "../../interface/UserDao";

export class DynamoDBUserDao implements UserDao {
  public async getUser(alias: string): Promise<UserDto> {
    // TODO
    return {} as any;
  }

  public async getSavedPasswordHash(alias: string): Promise<string> {
    // TODO
    return "";
  }

  public async createUser(firstName: string, lastName: string, alias: string, imageUrl: string, passwordHash: string): Promise<UserDto> {
    // TODO
    return {} as any;
  }

  public async getFollowCounts(alias: string): Promise<[number, number]> {
    // TODO
    return [0, 0];
  }

  public async incrementNumFollowees(alias: string): Promise<void> {
    // TODO
  }

  public async incrementNumFollowers(alias: string): Promise<void> {
    // TODO
  }

  public async decrementNumFollowees(alias: string): Promise<void> {
    // TODO
  }

  public async decrementNumFollowers(alias: string): Promise<void> {
    // TODO
  }
}
