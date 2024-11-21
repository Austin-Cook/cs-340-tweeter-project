import { DynamoDBAuthDao } from "../dynamodb-dao/DynamoDBAuthDao";
import { DynamoDBFollowDao } from "../dynamodb-dao/DynamoDBFollowDao";
import { DynamoDBStatusDao } from "../dynamodb-dao/DynamoDBStatusDao";
import { DynamoDBUserDao } from "../dynamodb-dao/DynamoDBUserDao";
import { IAuthDao } from "../interface/IAuthDao";
import { IFollowDao } from "../interface/IFollowDao";
import { IImageDao } from "../interface/IImageDao";
import { IStatusDao } from "../interface/IStatusDao";
import { IUserDao } from "../interface/IUserDao";
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

  public createAuthDao(): IAuthDao {
    return new DynamoDBAuthDao();
  }

  public createFollowDao(): IFollowDao {
    return new DynamoDBFollowDao();
  }

  public createStatusDao(): IStatusDao {
    return new DynamoDBStatusDao();
  }

  public createUserDao(): IUserDao {
    return new DynamoDBUserDao();
  }

  public createImageDao(): IImageDao {
    return new S3ImageDao();
  }
}
