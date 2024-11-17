import { UserDto } from "tweeter-shared";

export interface UserDao {
  getUser: (alias: string) => Promise<UserDto | null>;
  getSavedPasswordHash: (alias: string) => Promise<string>;
  createUser: (user: UserDto, passwordHash: string) => Promise<void>;
  getFollowCounts: (alias: string) => Promise<[number, number]>; // [followerCount, followeeCount]
  incrementNumFollowees: (alias: string) => Promise<void>;
  incrementNumFollowers: (alias: string) => Promise<void>;
  decrementNumFollowees: (alias: string) => Promise<void>;
  decrementNumFollowers: (alias: string) => Promise<void>;
}
