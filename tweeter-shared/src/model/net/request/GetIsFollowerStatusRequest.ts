import { UserDto } from "../../dto/UserDto";
import { UserActionRequest } from "./UserActionRequest";

export interface GetIsFollowerStatusRequest extends UserActionRequest {
  readonly selectedUser: UserDto;
}
