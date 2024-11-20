import { StatusDto } from "tweeter-shared";
import { getMissingRequestFieldMessage, getMissingStatusFieldMessage, getMissingUserFieldMessage } from "./Error";

export const validateRequest = (...inputItems: any): void => {
  for (let i = 0; i < inputItems.length; i++) {
    if (inputItems[i] === undefined) {
      throw new Error(getMissingRequestFieldMessage());
    }
  }
};

export const validateUser = (user: any): void => {
  if (user.firstName == null || user.lastName == null || user.alias == null || user.imageUrl == null) {
    throw new Error(getMissingUserFieldMessage());
  }
};

export const validateUser_MayBeNull = (user: any): void => {
  if (user == null) {
    return;
  }

  validateUser(user);
};

export const validateStatus = (status: StatusDto): void => {
  if (status.post == null || status.user == null || status.timestamp == null) {
    throw new Error(getMissingStatusFieldMessage());
  }
  validateUser(status.user);
};

export const validateStatus_MayBeNull = (status: StatusDto | null): void => {
  if (status == null) {
    return;
  }

  validateStatus(status);
};
