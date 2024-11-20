import { StatusDto } from "tweeter-shared";
import { StatusDao } from "../../interface/StatusDao";
import { DynamoDBDocumentClient, PutCommand, QueryCommandInput, BatchWriteCommand, BatchWriteCommandInput } from "@aws-sdk/lib-dynamodb";
import { Client } from "../DynamoDBClient";
import { doFailureReportingOperation } from "../../../util/FailureReportingOperation";
import { loadPagedItems } from "./util/LoadPagedItems";
import { format } from "date-fns";

interface StatusDBRow {
  alias: string,
  timestamp: number,
  post: string,
  first_name: string,
  last_name: string,
  image_url: string
}

export class DynamoDBStatusDao implements StatusDao {
  /**
   * Story - User views their own posts
   * 
   * Partition Key: alias(S)
   * Sort Key: timestamp(N) (milliseconds)
   * first_name(S)
   * last_name(S)
   * image_url(S)
   * post(S)
   */
  readonly statusTableName = "status";

  /**
   * Feed - User views their followees' posts
   * 
   * Partition: follower_alias(S)
   * Sort: timestamp_alias(S) string-concatenated (milliseconds)
   * timestamp(N)
   * alias(S)
   * first_name(S)
   * last_name(S)
   * image_url(S)
   * post(S)
   */
  readonly feedTableName = "feed";

  readonly aliasAttr = "alias";
  readonly timestampAttr = "timestamp";
  readonly postAttr = "post";
  readonly firstNameAttr = "first_name";
  readonly lastNameAttr = "last_name";
  readonly imageUrlAttr = "image_url";
  readonly followerAliasAttr = "follower_alias";
  readonly timestampAliasAttr = "timestamp_alias";

  private readonly client: DynamoDBDocumentClient = Client.instance;

  public async loadMoreFeedItems(followerAlias: string, pageSize: number, lastItem: StatusDto | undefined): Promise<[StatusDto[], boolean]> {
    const params = {
      KeyConditionExpression: this.followerAliasAttr + " = :followerAlias",
      ExpressionAttributeValues: {
        ":followerAlias": followerAlias,
      },
      TableName: this.feedTableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastItem === undefined
          ? undefined
          : {
            [this.followerAliasAttr]: followerAlias,
            [this.timestampAliasAttr]: this.createTimeStampAliasValue(lastItem.timestamp, lastItem.user.alias),
          }
    };

    return await this.loadPagedStatusItems(params, "loadMoreFeedItems");
  }

  public async loadMoreStoryItems(alias: string, pageSize: number, lastItem: StatusDto | undefined): Promise<[StatusDto[], boolean]> {
    const params = {
      KeyConditionExpression: this.aliasAttr + " = :alias",
      ExpressionAttributeValues: {
        ":alias": alias,
      },
      TableName: this.statusTableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastItem === undefined
          ? undefined
          : {
            [this.aliasAttr]: alias,
            [this.timestampAttr]: lastItem.timestamp,
          }
    };

    return await this.loadPagedStatusItems(params, "loadMoreFeedItems");
  }

  public async postStatus(newStatus: StatusDto): Promise<void> {
    await doFailureReportingOperation(async () => {
      const params = {
        TableName: this.statusTableName,
        Item: {
          [this.aliasAttr]: newStatus.user.alias,
          [this.timestampAttr]: newStatus.timestamp,
          [this.postAttr]: newStatus.post,
          [this.firstNameAttr]: newStatus.user.firstName,
          [this.lastNameAttr]: newStatus.user.lastName,
          [this.imageUrlAttr]: newStatus.user.imageUrl
        },
        ConditionExpression: `attribute_not_exists(#aliasAttr) AND attribute_not_exists(#timestampAttr)`,
        ExpressionAttributeNames: {
          '#aliasAttr': this.aliasAttr,
          '#timestampAttr': this.timestampAttr,
        }
      };
      await this.client.send(new PutCommand(params));
    },
      "DynamoDBStatusDao",
      "postStatus"
    );
  }

  public async addStatusesToUsersFeed(followerAliases: string[], status: StatusDto): Promise<void> {
    await doFailureReportingOperation(async () => {
      if (!followerAliases || followerAliases.length == 0) {
        // no statuses to add
        return;
      }

      const batches: string[][] = []
      while (followerAliases.length > 0) {
        batches.push(followerAliases.splice(0, 25)); // Max 25 items allowed
      }

      for (const batch of batches) {
        let unprocessedItems: Record<string, {}>[] = batch.map<Record<string, {}>>((followerAlias) => ({
          PutRequest: {
            Item: {
              [this.followerAliasAttr]: followerAlias,
              [this.timestampAliasAttr]: this.createTimeStampAliasValue(status.timestamp, status.user.alias),
              [this.aliasAttr]: status.user.alias,
              [this.timestampAttr]: status.timestamp,
              [this.postAttr]: status.post,
              [this.firstNameAttr]: status.user.firstName,
              [this.lastNameAttr]: status.user.lastName,
              [this.imageUrlAttr]: status.user.imageUrl
            },
            ConditionExpression: `attribute_not_exists(#followerAliasAttr) AND attribute_not_exists(#timestampAliasAttr)`,
            ExpressionAttributeNames: {
              '#followerAliasAttr': this.followerAliasAttr,
              '#timestampAliasAttr': this.timestampAliasAttr,
            },
          }
        }));

        while (unprocessedItems.length > 0) {
          const params: BatchWriteCommandInput = {
            RequestItems: {
              [this.feedTableName]: unprocessedItems
            },
          };

          const result = await this.client.send(new BatchWriteCommand(params));

          unprocessedItems = result.UnprocessedItems?.[this.feedTableName] || [];
        }
      }
    },
      "DynamoDBStatusDao",
      "addStatusesToUsersFeed"
    )
  }

  private loadPagedStatusItems = async (params: QueryCommandInput, daoMethod: string) => {
    return loadPagedItems(this.client, params, this.buildStatusDto, "DynamoDBStatusDao", daoMethod);
  }

  private buildStatusDto = (item: StatusDBRow) => {
    return {
      post: item[this.postAttr],
      user: {
        firstName: item[this.firstNameAttr],
        lastName: item[this.lastNameAttr],
        alias: item[this.aliasAttr],
        imageUrl: item[this.imageUrlAttr]
      },
      timestamp: item[this.timestampAttr],
    };
  }

  private createTimeStampAliasValue(timestamp: number, alias: string): string {
    return format(timestamp, "yyyy-MM-dd-HH:mm:ss") + alias;
  }
}
