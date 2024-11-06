import { AuthenticatedRequest } from "./AuthenticatedRequest";
import { TweeterRequest } from "./TweeterRequest";

export interface PagedItemRequest extends TweeterRequest, AuthenticatedRequest {
  readonly userAlias: string;
  readonly pageSize: number;
}
