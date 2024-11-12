import { StatusDto } from "tweeter-shared";

export interface StatusDao {
  loadMoreFeedItems: (alias: string, pageSize: number, lastItem: StatusDto | undefined) => Promise<[StatusDto[], boolean]>;
  loadMoreStoryItems: (alias: string, pageSize: number, lastItem: StatusDto | undefined) => Promise<[StatusDto[], boolean]>;
  postStatus: (newStatus: StatusDto) => Promise<void>;
  addStatusToUsersFeed: (alias: string, status: StatusDto) => Promise<void>;
}
