import { StatusDto } from "tweeter-shared";

export interface IStatusDao {
  loadMoreFeedItems: (alias: string, pageSize: number, lastItem: StatusDto | undefined) => Promise<[StatusDto[], boolean]>;
  loadMoreStoryItems: (alias: string, pageSize: number, lastItem: StatusDto | undefined) => Promise<[StatusDto[], boolean]>;
  postStatus: (newStatus: StatusDto) => Promise<void>;
  addStatusesToUsersFeed: (followerAliases: string[], status: StatusDto) => Promise<void>;
}
