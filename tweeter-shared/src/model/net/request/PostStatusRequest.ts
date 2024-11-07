import { StatusDto } from "../../dto/StatusDto";
import { AuthenticatedRequest } from "./AuthenticatedRequest";
import { TweeterRequest } from "./TweeterRequest";

export interface PostStatusRequest extends TweeterRequest, AuthenticatedRequest {
  readonly newStatus: StatusDto;
}
