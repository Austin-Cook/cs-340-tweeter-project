import { IAuthDao } from "../interface/IAuthDao";
import { IFollowDao } from "../interface/IFollowDao";
import { IImageDao } from "../interface/IImageDao";
import { IStatusDao } from "../interface/IStatusDao";
import { IUserDao } from "../interface/IUserDao";

export interface IDaoFactory {
  createAuthDao: () => IAuthDao;
  createFollowDao: () => IFollowDao;
  createStatusDao: () => IStatusDao;
  createUserDao: () => IUserDao;
  createImageDao: () => IImageDao;
}
