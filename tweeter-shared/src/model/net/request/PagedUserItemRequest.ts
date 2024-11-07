import { UserDto } from "../../dto/UserDto";
import { PagedItemRequest } from "./PagedItemRequest";
import { TweeterRequest } from "./TweeterRequest";

export interface PagedUserItemRequest extends TweeterRequest, PagedItemRequest {
  readonly lastItem: UserDto | null;
}
