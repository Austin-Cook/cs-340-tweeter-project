import { AuthenticatedRequest } from "./AuthenticatedRequest";
import { TweeterRequest } from "./TweeterRequest";

export interface GetUserRequest extends TweeterRequest, AuthenticatedRequest {
  readonly alias: string;
}
