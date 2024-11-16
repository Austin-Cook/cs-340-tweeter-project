import { AuthDao } from "../interface/AuthDao";
import { FollowDao } from "../interface/FollowDao";
import { ImageDao } from "../interface/ImageDao";
import { StatusDao } from "../interface/StatusDao";
import { UserDao } from "../interface/UserDao";

export interface DaoFactory {
  createAuthDao: () => AuthDao;
  createFollowDao: () => FollowDao;
  createStatusDao: () => StatusDao;
  createUserDao: () => UserDao;
  createImageDao: () => ImageDao;
}
