import { StatusDto } from "tweeter-shared";

export const validRequest = (...inputItems: any): boolean => {
  for (let i = 0; i < inputItems.length; i++) {
    if (inputItems[i] === undefined) {
      return false;
    }
  }
  return true;
}

export const validateUser = (user: any): boolean => {
  return user.firstName != null && user.lastName != null && user.alias != null && user.imageUrl != null;
}

export const validateStatus = (status: StatusDto): boolean => {
  return status.post != null && status.user != null && validateUser(status.user) && status.timestamp != null;
}
