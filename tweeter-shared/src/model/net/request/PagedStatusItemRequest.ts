import { StatusDto } from "../../dto/StatusDto";
import { PagedItemRequest } from "./PagedItemRequest";
import { TweeterRequest } from "./TweeterRequest";

export interface PagedStatusItemRequest extends TweeterRequest, PagedItemRequest {
  readonly lastItem: StatusDto | null;
}
