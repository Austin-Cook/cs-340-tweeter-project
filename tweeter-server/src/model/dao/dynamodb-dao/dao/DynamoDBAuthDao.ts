import { AuthTokenDto, UserDto } from "tweeter-shared";
import { AuthDao } from "../../interface/AuthDao";
import { doFailureReportingOperation } from "../../util/FailureReportingOperation";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Client } from "../DynamoDBClient";

export class DynamoDBAuthDao implements AuthDao {
  readonly tableName = "auth"; // Partition: token(S), Attrs: timestamp(N), alias(S)
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

  public async getAuthenticatedUser(token: string): Promise<[UserDto, number]> {
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
