import { UserDto } from "tweeter-shared";
import { UserDao } from "../../interface/UserDao";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { Client } from "../DynamoDBClient";
import { doFailureReportingOperation } from "../../util/FailureReportingOperation";

export class DynamoDBUserDao implements UserDao {
  readonly tableName = "user"; // Partition: token(S), Attrs: timestamp(N), alias(S)
  readonly aliasAttr = "alias";
  readonly firstNameAttr = "first_name";
  readonly lastNameAttr = "last_name";
  readonly imageUrlAttr = "image_url";
  readonly numFollowersAttr = "num_followers";
  readonly numFolloweesAttr = "num_followees";
  readonly passwordHashAttr = "password_hash";

  private readonly client: DynamoDBDocumentClient = Client.instance;

  public async getUser(alias: string): Promise<UserDto> {
    return await doFailureReportingOperation(async () => {
      const params = {
        TableName: this.tableName,
        Key: this.generateUserKeyItem(alias),
        ProjectionExpression: '#firstNameAttr, #lastNameAttr, #aliasAttr, #imgUrlAttr',
        ExpressionAttributeNames: {
          '#firstNameAttr': this.firstNameAttr,
          '#lastNameAttr': this.lastNameAttr,
          '#aliasAttr': this.aliasAttr,
          '#imgUrlAttr': this.imageUrlAttr
        }
      };
      const output = await this.client.send(new GetCommand(params));
      if (output.Item == undefined) {
        throw new Error("User not found in database");
      }
      return {
        firstName: output.Item[this.firstNameAttr],
        lastName: output.Item[this.lastNameAttr],
        alias: output.Item[this.aliasAttr],
        imageUrl: output.Item[this.imageUrlAttr],
      }
    },
      "DynamoDBUserDao",
      "getUser"
    );
  }

  public async getSavedPasswordHash(alias: string): Promise<string> {
    return await doFailureReportingOperation(async () => {
      const params = {
        TableName: this.tableName,
        Key: this.generateUserKeyItem(alias),
        ProjectionExpression: '#passwordHashAttr',
        ExpressionAttributeNames: {
          '#passwordHashAttr': this.passwordHashAttr,
        }
      };
      const output = await this.client.send(new GetCommand(params));
      if (output.Item == undefined) {
        throw new Error("User not found in database");
      }
      return output.Item[this.passwordHashAttr];
    },
      "DynamoDBUserDao",
      "getSavedPasswordHash"
    );
  }

  public async createUser(user: UserDto, passwordHash: string): Promise<void> {
    await doFailureReportingOperation(async () => {
      const params = {
        TableName: this.tableName,
        Item: {
          [this.aliasAttr]: user.alias,
          [this.firstNameAttr]: user.firstName,
          [this.lastNameAttr]: user.lastName,
          [this.imageUrlAttr]: user.imageUrl,
          [this.passwordHashAttr]: passwordHash,
          [this.numFollowersAttr]: 0,
          [this.numFolloweesAttr]: 0
        },
        ConditionExpression: `attribute_not_exists(#aliasAttr)`,
        ExpressionAttributeNames: {
          '#aliasAttr': this.aliasAttr,
        }
      };
      await this.client.send(new PutCommand(params));
    },
      "DynamoDBUserDao",
      "createUser"
    );
  }

  /**
   * @returns [followerCount, followeeCount]
   */
  public async getFollowCounts(alias: string): Promise<[number, number]> {
    return await doFailureReportingOperation(async () => {
      const params = {
        TableName: this.tableName,
        Key: this.generateUserKeyItem(alias),
        ProjectionExpression: '#numFollowersAttr, #numFolloweesAttr',
        ExpressionAttributeNames: {
          '#numFollowersAttr': this.numFollowersAttr,
          '#numFolloweesAttr': this.numFolloweesAttr,
        }
      };
      const output = await this.client.send(new GetCommand(params));
      if (output.Item == undefined) {
        throw new Error("User not found in database");
      }
      return [output.Item[this.numFollowersAttr], output.Item[this.numFolloweesAttr]];
    },
      "DynamoDBUserDao",
      "getFollowCounts"
    );
  }

  public async incrementNumFollowees(alias: string): Promise<void> {
    await this.incrementValue(alias, this.numFolloweesAttr, "incrementNumFollowees");
  }

  public async incrementNumFollowers(alias: string): Promise<void> {
    await this.incrementValue(alias, this.numFollowersAttr, "incrementNumFollowers");
  }

  public async decrementNumFollowees(alias: string): Promise<void> {
    await this.decrementValue(alias, this.numFolloweesAttr, "decrementNumFollowees");
  }

  public async decrementNumFollowers(alias: string): Promise<void> {
    await this.decrementValue(alias, this.numFollowersAttr, "decrementNumFollowers");
  }

  private async incrementValue(alias: string, attr: string, daoMethod: string): Promise<void> {
    await this.incrementDecrementValue(alias, attr, true, daoMethod);
  }

  private async decrementValue(alias: string, attr: string, daoMethod: string): Promise<void> {
    await this.incrementDecrementValue(alias, attr, false, daoMethod);
  }

  private async incrementDecrementValue(alias: string, attr: string, increment: boolean, daoMethod: string): Promise<void> {
    await doFailureReportingOperation(async () => {
      const params = {
        TableName: this.tableName,
        Key: this.generateUserKeyItem(alias),
        ExpressionAttributeValues: { ":increment": 1 },
        UpdateExpression:
          "SET " + attr + " = " + attr + " " + (increment ? "+" : "-") + " :increment",
      };
      await this.client.send(new UpdateCommand(params));
    },
      "DynamoDBUserDao",
      daoMethod
    )
  }

  private generateUserKeyItem(alias: string) {
    return {
      [this.aliasAttr]: alias,
    }
  }
}
