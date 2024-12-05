import { StatusDto } from "../../dto/StatusDto";
import { TweeterRequest } from "./TweeterRequest";

export interface UpdateFeedRequest extends TweeterRequest {
  readonly followerAliases: string[];
  readonly newStatus: StatusDto
}
