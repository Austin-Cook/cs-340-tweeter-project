import { UserDto } from "../../dto/UserDto";
import { AuthenticatedRequest } from "./AuthenticatedRequest";
import { TweeterRequest } from "./TweeterRequest";

export interface UserActionRequest extends TweeterRequest, AuthenticatedRequest {
  readonly user: UserDto;
}
