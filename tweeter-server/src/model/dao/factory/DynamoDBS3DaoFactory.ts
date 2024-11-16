import { DynamoDBAuthDao } from "../dynamodb-dao/dao/DynamoDBAuthDao";
import { DynamoDBFollowDao } from "../dynamodb-dao/dao/DynamoDBFollowDao";
import { DynamoDBStatusDao } from "../dynamodb-dao/dao/DynamoDBStatusDao";
import { DynamoDBUserDao } from "../dynamodb-dao/dao/DynamoDBUserDao";
import { AuthDao } from "../interface/AuthDao";
import { FollowDao } from "../interface/FollowDao";
import { ImageDao } from "../interface/ImageDao";
import { StatusDao } from "../interface/StatusDao";
import { UserDao } from "../interface/UserDao";
import { S3ImageDao } from "../s3-dao/S3ImageDao";
import { DaoFactory } from "./DaoFactory";

export class DynamoDBS3DaoFactory implements DaoFactory {
  private static _instance: DynamoDBS3DaoFactory;

  public static get instance(): DynamoDBS3DaoFactory {
    if (this._instance == null) {
      this._instance = new DynamoDBS3DaoFactory();
    }

    return this._instance;
  }

  public createAuthDao(): AuthDao {
    return new DynamoDBAuthDao();
  }

  public createFollowDao(): FollowDao {
    return new DynamoDBFollowDao();
  }

  public createStatusDao(): StatusDao {
    return new DynamoDBStatusDao();
  }

  public createUserDao(): UserDao {
    return new DynamoDBUserDao();
  }

  public createImageDao(): ImageDao {
    return new S3ImageDao();
  }
}
