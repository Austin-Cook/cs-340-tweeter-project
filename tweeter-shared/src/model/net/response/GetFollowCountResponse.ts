import { TweeterResponse } from "./TweeterResponse";

export interface GetFollowCountResponse extends TweeterResponse {
  readonly followCount: number
}
