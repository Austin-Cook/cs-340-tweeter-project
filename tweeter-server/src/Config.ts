import { DaoFactory } from "./model/dao/factory/DaoFactory";
import { DynamoDBS3DaoFactory } from "./model/dao/factory/DynamoDBS3DaoFactory";

export const getDaoFactory = (): DaoFactory => {
  return DynamoDBS3DaoFactory.instance;
};
