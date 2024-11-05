import { UserDto } from "../../dto/UserDto";
import { AuthenticatedRequest } from "./AuthenticatedRequest";

export interface UserActionRequest extends AuthenticatedRequest {
  readonly user: UserDto;
}
