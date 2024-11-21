import { IDaoFactory } from "./model/dao/factory/IDaoFactory";
import { DynamoDBS3DaoFactory } from "./model/dao/factory/DynamoDBS3DaoFactory";

export const getDaoFactory = (): IDaoFactory => {
  return DynamoDBS3DaoFactory.instance;
};
