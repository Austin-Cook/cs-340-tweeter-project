import { TweeterResponse } from "./TweeterResponse";

export interface FollowUnfollowResponse extends TweeterResponse {
  readonly followerCount: number | null;
  readonly followeeCount: number | null;
}
