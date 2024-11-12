import { UserDto } from "tweeter-shared";

export interface UserDao {
  getUser: (alias: string) => Promise<UserDto>;
  getSavedPasswordHash: (alias: string) => Promise<string>;
  createUser: (firstName: string, lastName: string, alias: string, imageUrl: string, passwordHash: string) => Promise<UserDto>;
  getFollowCounts: (alias: string) => Promise<[number, number]>; // [followerCount, followeeCount]
  incrementNumFollowees: (alias: string) => Promise<void>;
  incrementNumFollowers: (alias: string) => Promise<void>;
  decrementNumFollowees: (alias: string) => Promise<void>;
  decrementNumFollowers: (alias: string) => Promise<void>;
}