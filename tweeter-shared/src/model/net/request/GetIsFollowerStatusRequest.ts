import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";
import { UserActionRequest } from "./UserActionRequest";

export interface GetIsFollowerStatusRequest extends TweeterRequest, UserActionRequest {
  readonly selectedUser: UserDto;
}
