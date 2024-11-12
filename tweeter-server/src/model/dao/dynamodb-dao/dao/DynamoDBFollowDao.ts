import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { UserDto } from "tweeter-shared";
import { FollowDao } from "../../interface/FollowDao";
import { Client } from "../DynamoDBClient";
import { doFailureReportingOperation } from "../../util/FailureReportingOperation";

export class DynamoDBFollowDao implements FollowDao {
  readonly tableName = "follow"; // a -> follows -> b
  readonly indexName = "followed_by"; // a -> followed by -> b
  readonly followerHandleAttr = "follower_handle";
  readonly followeeHandleAttr = "followee_handle";
  readonly followerFirstNameAttr = "follower_first_name";
  readonly followeeFirstNameAttr = "followee_first_name";
  readonly followerLastNameAttr = "follower_last_name";
  readonly followeeLastNameAttr = "followee_last_name";
  readonly followerImgUrlAttr = "follower_img_url";
  readonly followeeImgUrlAttr = "followee_img_url";

  private readonly client: DynamoDBDocumentClient = Client.instance;

  public async loadMoreFollowers(alias: string, pageSize: number, lastItem: UserDto | undefined): Promise<[UserDto[], boolean]> {
    return await doFailureReportingOperation(async (): Promise<[UserDto[], boolean]> => {
      const params = {
        KeyConditionExpression: this.followeeHandleAttr + " = :followee",
        ExpressionAttributeValues: {
          ":followee": alias,
        },
        TableName: this.tableName,
        IndexName: this.indexName,
        Limit: pageSize,
        ExclusiveStartKey:
          lastItem === undefined
            ? undefined
            : {
              [this.followerHandleAttr]: lastItem.alias,
              [this.followeeHandleAttr]: alias,
            },
      };

      const items: UserDto[] = [];
      const data = await this.client.send(new QueryCommand(params));
      const hasMorePages = data.LastEvaluatedKey !== undefined;
      data.Items?.forEach((item) => {
        const follower: UserDto = {
          firstName: item[this.followerFirstNameAttr],
          lastName: item[this.followerLastNameAttr],
          alias: item[this.followerHandleAttr],
          imageUrl: item[this.followerImgUrlAttr]
        };
        items.push(
          follower
        )
      });

      return [items, hasMorePages];
    },
      "DynamoDBFollowDao",
      "loadMoreFollowers"
    );
  }

  public async loadMoreFollowees(alias: string, pageSize: number, lastItem: UserDto | undefined): Promise<[UserDto[], boolean]> {
    return await doFailureReportingOperation(async () => {
      const params = {
        KeyConditionExpression: this.followerHandleAttr + " = :follower",
        ExpressionAttributeValues: {
          ":follower": alias,
        },
        TableName: this.tableName,
        Limit: pageSize,
        ExclusiveStartKey:
          lastItem === undefined
            ? undefined
            : {
              [this.followerHandleAttr]: alias,
              [this.followeeHandleAttr]: lastItem.alias,
            },
      };

      const items: UserDto[] = [];
      const data = await this.client.send(new QueryCommand(params));
      const hasMorePages = data.LastEvaluatedKey !== undefined;
      data.Items?.forEach((item) => {
        const followee: UserDto = {
          firstName: item[this.followeeFirstNameAttr],
          lastName: item[this.followeeLastNameAttr],
          alias: item[this.followeeHandleAttr],
          imageUrl: item[this.followeeImgUrlAttr]
        };
        items.push(
          followee
        )
      });

      return [items, hasMorePages];
    },
      "DynamoDBFollowDao",
      "loadMoreFollowees"
    );
  }

  /**
   * Used in StatusDao::addStatusToUsersFeed for precomputing feed for each user
   */
  public async getAllFollowerAliases(alias: string): Promise<string[]> {
    return await doFailureReportingOperation(async () => {
      const aliases: string[] = [];

      let hasMorePages = true;
      let lastFollowerAlias: string | undefined = undefined;
      while (hasMorePages) {
        const params = {
          KeyConditionExpression: this.followeeHandleAttr + " = :followee",
          ExpressionAttributeValues: {
            ":followee": alias,
          },
          TableName: this.tableName,
          IndexName: this.indexName,
          ExclusiveStartKey:
            lastFollowerAlias === undefined
              ? undefined
              : {
                [this.followerHandleAttr]: lastFollowerAlias,
                [this.followeeHandleAttr]: alias,
              },
          ProjectionExpression: '#followerHandleAttr',
          ExpressionAttributeNames: {
            '#followerHandleAttr': this.followerHandleAttr,
          }
        };

        const data = await this.client.send(new QueryCommand(params));
        data.Items?.forEach((item) =>
          aliases.push(item[this.followerHandleAttr]));
        hasMorePages = data.LastEvaluatedKey !== undefined;
        lastFollowerAlias = aliases[aliases.length - 1];
      }

      return aliases;
    },
      "DynamoDBFollowDao",
      "getAllFollowerAliases"
    );
  }

  public async createFollow(follower: UserDto, followee: UserDto): Promise<void> {
    await doFailureReportingOperation(async () => {
      const params = {
        TableName: this.tableName,
        Item: {
          [this.followerHandleAttr]: follower.alias,
          [this.followeeHandleAttr]: followee.alias,
          [this.followerFirstNameAttr]: follower.firstName,
          [this.followeeFirstNameAttr]: followee.firstName,
          [this.followerLastNameAttr]: follower.lastName,
          [this.followeeLastNameAttr]: followee.lastName,
          [this.followerImgUrlAttr]: follower.imageUrl,
          [this.followeeImgUrlAttr]: followee.imageUrl,
        },
        ConditionExpression: `attribute_not_exists(#followerHandleAttr) AND attribute_not_exists(#followeeHandleAttr)`,
        ExpressionAttributeNames: {
          '#followerHandleAttr': this.followerHandleAttr,
          '#followeeHandleAttr': this.followeeHandleAttr,
        }
      };
      await this.client.send(new PutCommand(params));
    },
      "DynamoDBFollowDao",
      "createFollow"
    );
  }

  public async removeFollow(followerAlias: string, followeeAlias: string): Promise<void> {
    await doFailureReportingOperation(async () => {
      const params = {
        TableName: this.tableName,
        Key: this.generateFollowKeyItem(followerAlias, followeeAlias),
        ConditionExpression: `attribute_exists(#followerHandleAttr) AND attribute_exists(#followeeHandleAttr)`,
        ExpressionAttributeNames: {
          '#followerHandleAttr': this.followerHandleAttr,
          '#followeeHandleAttr': this.followeeHandleAttr,
        }
      };
      await this.client.send(new DeleteCommand(params));
    },
      "DynamoDBFollowDao",
      "removeFollow"
    );
  }

  public async isFollower(followerAlias: string, followeeAlias: string): Promise<boolean> {
    return await doFailureReportingOperation(async () => {
      const params = {
        TableName: this.tableName,
        Key: this.generateFollowKeyItem(followerAlias, followeeAlias),
      };
      const output = await this.client.send(new GetCommand(params));
      return output.Item != undefined;
    },
      "DynamoDBFollowDao",
      "isFollower"
    );
  }

  private generateFollowKeyItem(followerAlias: string, followeeAlias: string) {
    return {
      [this.followerHandleAttr]: followerAlias,
      [this.followeeHandleAttr]: followeeAlias
    }
  }
}
