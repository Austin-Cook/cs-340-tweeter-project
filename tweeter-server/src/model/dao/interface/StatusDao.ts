import { StatusDto } from "tweeter-shared";

export interface StatusDao {
  loadMoreFeedItems: (alias: string, pageSize: number, lastItem: StatusDto | null) => Promise<[StatusDto[], boolean]>;
  loadMoreStoryItems: (alias: string, pageSize: number, lastItem: StatusDto | null) => Promise<[StatusDto[], boolean]>;
  postStatus: (token: string, newStatus: StatusDto) => Promise<void>;
  addStatusToUsersFeed: (alias: string, status: StatusDto) => Promise<void>;
}
