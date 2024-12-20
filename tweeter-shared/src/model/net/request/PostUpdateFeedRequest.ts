import { StatusDto } from "../../dto/StatusDto";
import { TweeterRequest } from "./TweeterRequest";

export interface PostUpdateFeedRequest extends TweeterRequest {
  readonly newStatus: StatusDto
}
