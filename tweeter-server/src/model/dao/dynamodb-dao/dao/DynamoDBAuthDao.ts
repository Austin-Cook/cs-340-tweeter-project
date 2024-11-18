import { AuthTokenDto, UserDto } from "tweeter-shared";
import { AuthDao } from "../../interface/AuthDao";
import { doFailureReportingOperation } from "../../../util/FailureReportingOperation";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { Client } from "../DynamoDBClient";

export class DynamoDBAuthDao implements AuthDao {
  /**
   * Partition: token(S)
   * timestamp(N)
   * user(M)
   */
  readonly tableName = "auth";

  readonly tokenAttr = "token";
  readonly timestampAttr = "timestamp";
  readonly userAttr = "user";

  private readonly client: DynamoDBDocumentClient = Client.instance;

  public async createAuthToken(authToken: AuthTokenDto, user: UserDto): Promise<void> {
    await doFailureReportingOperation(async () => {
      const params = {
        TableName: this.tableName,
        Item: {
          [this.tokenAttr]: authToken.token,
          [this.timestampAttr]: authToken.timestamp,
          [this.userAttr]: user,
        },
        ConditionExpression: `attribute_not_exists(#tokenAttr)`,
        ExpressionAttributeNames: {
          '#tokenAttr': this.tokenAttr,
        }
      };
      await this.client.send(new PutCommand(params));
    },
      "DynamoDBAuthDao",
      "createAuthToken"
    );
  }

  public async renewAuthToken(token: string, newTimestamp: number) {
    return await doFailureReportingOperation(async () => {
      const params = {
        TableName: this.tableName,
        Key: this.generateAuthKeyItem(token),
        ExpressionAttributeNames: {
          '#tokenAttr': this.tokenAttr,
          "#timestampAttr": this.timestampAttr
        },
        ExpressionAttributeValues: { ":newTimestamp": newTimestamp },
        UpdateExpression:
          "SET #timestampAttr = :newTimestamp",
        ConditionExpression: `attribute_exists(#tokenAttr)`,
      };
      await this.client.send(new UpdateCommand(params));
    },
      "DynamoDBAuthDao",
      "renewAuthToken"
    )
  }

  public async getUser(token: string): Promise<[UserDto, number]> {
    return await doFailureReportingOperation(async () => {
      const params = {
        TableName: this.tableName,
        Key: this.generateAuthKeyItem(token),
      };
      const output = await this.client.send(new GetCommand(params));
      if (output.Item == undefined) {
        throw new Error("AuthToken not found in database");
      }
      return [output.Item[this.userAttr], output.Item[this.timestampAttr]]
    },
      "DynamoDBAuthDao",
      "getAuthenticatedUser"
    );
  }

  public async getTimestamp_Soft(token: string): Promise<number | null> {
    return await doFailureReportingOperation(async () => {
      const params = {
        TableName: this.tableName,
        Key: this.generateAuthKeyItem(token),
        ProjectionExpression: '#timestampAttr',
        ExpressionAttributeNames: {
          '#timestampAttr': this.timestampAttr,
        }
      };
      const output = await this.client.send(new GetCommand(params));
      if (output.Item == undefined) {
        // token doesn't exist
        return null;
      }

      return output.Item[this.timestampAttr];
    },
      "DynamoDBAuthDao",
      "getTimestamp_Soft"
    );
  }

  /**
   * Note that we don't check if the token exists. This allows a user to follow the log out process
   * even after a token has expired with no issues.
   */
  public async revokeToken(token: string): Promise<void> {
    return await doFailureReportingOperation(async () => {
      const params = {
        TableName: this.tableName,
        Key: this.generateAuthKeyItem(token),
      };
      await this.client.send(new DeleteCommand(params));
    },
      "DynamoDBAuthDao",
      "revokeToken"
    );
  }

  private generateAuthKeyItem(token: string) {
    return {
      [this.tokenAttr]: token,
    }
  }
}
