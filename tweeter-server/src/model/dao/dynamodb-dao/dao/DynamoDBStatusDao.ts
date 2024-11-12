import { StatusDto } from "tweeter-shared";
import { StatusDao } from "../../interface/StatusDao";
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { Client } from "../DynamoDBClient";
import { doFailureReportingOperation } from "../../util/FailureReportingOperation";

export class DynamoDBStatusDao implements StatusDao {
  readonly statusTableName = "status"; // Partition: alias(S), Sort: timestamp(N), Attrs: post(S), firstName(S), lastName(S), imgUrl(S)
  readonly aliasAttr = "alias";
  readonly timestampAttr = "timestamp";
  readonly postAttr = "post";
  readonly firstNameAttr = "first_name";
  readonly lastNameAttr = "last_name";
  readonly imageUrlAttr = "image_url";
  readonly feedTableName = "feed"; // Partition: follower_alias(S), Sort: timestamp, Attrs: alias(S), post(S), firstName(S), lastName(S), imgUrl(S)
  readonly followerAliasAttr = "follower_alias"

  private readonly client: DynamoDBDocumentClient = Client.instance;

  public async loadMoreFeedItems(alias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]> {
    // TODO
    return [{} as any, true];
  }

  public async loadMoreStoryItems(alias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]> {
    // TODO
    return [{} as any, true];
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

  public async addStatusToUsersFeed(followerAlias: string, status: StatusDto): Promise<void> {
    await doFailureReportingOperation(async () => {
      const params = {
        TableName: this.feedTableName,
        Item: {
          [this.followerAliasAttr]: followerAlias,
          [this.timestampAttr]: status.timestamp,
          [this.aliasAttr]: status.user.alias,
          [this.postAttr]: status.post,
          [this.firstNameAttr]: status.user.firstName,
          [this.lastNameAttr]: status.user.lastName,
          [this.imageUrlAttr]: status.user.imageUrl
        },
        ConditionExpression: `attribute_not_exists(#followerAliasAttr) AND attribute_not_exists(#timestampAttr)`,
        ExpressionAttributeNames: {
          '#followerAliasAttr': this.followerAliasAttr,
          '#timestampAttr': this.timestampAttr,
        }
      };
      await this.client.send(new PutCommand(params));
    },
      "DynamoDBStatusDao",
      "addStatusToUsersFeed"
    )
  }
}
