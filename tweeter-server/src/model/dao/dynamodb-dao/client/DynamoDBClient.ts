import {
  DynamoDBDocumentClient
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class Client {
  private static _instance: DynamoDBDocumentClient;

  public static get instance(): DynamoDBDocumentClient {
    if (this._instance == null) {
      this._instance = DynamoDBDocumentClient.from(new DynamoDBClient());
    }

    return this._instance;
  }
}
