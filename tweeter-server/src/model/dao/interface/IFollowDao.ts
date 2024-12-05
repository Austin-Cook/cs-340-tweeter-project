import { UserDto } from "tweeter-shared";

export interface IFollowDao {
  loadMoreFollowers: (alias: string, pageSize: number, lastItem: UserDto | undefined) => Promise<[UserDto[], boolean]>;
  loadMoreFollowees: (alias: string, pageSize: number, lastItem: UserDto | undefined) => Promise<[UserDto[], boolean]>;
  getAllFollowerAliases: (alias: string) => Promise<string[]>;
  createFollow: (follower: UserDto, followee: UserDto) => Promise<void>;
  removeFollow: (followerAlias: string, followeeAlias: string) => Promise<void>;
  isFollower: (followerAlias: string, followeeAlias: string) => Promise<boolean>;
  bulkFollow: (followers: UserDto[], followee: UserDto) => Promise<void>;
  getGroupOfAliases: (alias: string, lastFollowerAlias: string | undefined) => Promise<[string[], boolean]>;
}
