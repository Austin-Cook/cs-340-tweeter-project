import { TweeterResponse } from "./TweeterResponse";

export interface PagedItemResponse extends TweeterResponse {
  readonly hasMore: boolean | null;
}
