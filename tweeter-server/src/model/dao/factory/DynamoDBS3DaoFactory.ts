import { DynamoDBAuthDao } from "../dynamodb-dao/DynamoDBAuthDao";
import { DynamoDBFollowDao } from "../dynamodb-dao/DynamoDBFollowDao";
import { DynamoDBStatusDao } from "../dynamodb-dao/DynamoDBStatusDao";
import { DynamoDBUserDao } from "../dynamodb-dao/DynamoDBUserDao";
import { S3ImageDao } from "../s3-dao/S3ImageDao";
import { IDaoFactory } from "./IDaoFactory";

export class DynamoDBS3DaoFactory implements IDaoFactory {
  private static _instance: DynamoDBS3DaoFactory;

  public static get instance(): DynamoDBS3DaoFactory {
    if (this._instance == null) {
      this._instance = new DynamoDBS3DaoFactory();
    }

    return this._instance;
  }

  public createAuthDao(): DynamoDBAuthDao {
    return new DynamoDBAuthDao();
  }

  public createFollowDao(): DynamoDBFollowDao {
    return new DynamoDBFollowDao();
  }

  public createStatusDao(): DynamoDBStatusDao {
    return new DynamoDBStatusDao();
  }

  public createUserDao(): DynamoDBUserDao {
    return new DynamoDBUserDao();
  }

  public createImageDao(): S3ImageDao {
    return new S3ImageDao();
  }
}
