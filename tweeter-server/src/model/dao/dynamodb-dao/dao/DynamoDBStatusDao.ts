import { StatusDto } from "tweeter-shared";
import { StatusDao } from "../../interface/StatusDao";

export class DynamoDBStatusDao implements StatusDao {
  public async loadMoreFeedItems(alias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]> {
    // TODO
    return [{} as any, true];
  }

  public async loadMoreStoryItems(alias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]> {
    // TODO
    return [{} as any, true];
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    // TODO
  }

  public async addStatusToUsersFeed(alias: string, status: StatusDto): Promise<void> {
    // TODO
  }
}
