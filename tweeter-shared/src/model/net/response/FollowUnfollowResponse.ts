import { TweeterResponse } from "./TweeterResponse";

export interface FollowUnfollowResponse extends TweeterResponse {
  readonly followerCount: number,
  readonly followeeCount: number
}
