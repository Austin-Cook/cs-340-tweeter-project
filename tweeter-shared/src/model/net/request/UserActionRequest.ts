import { UserDto } from "../../dto/UserDto";

export interface UserActionRequest {
  readonly token: string,
  readonly user: UserDto
}
