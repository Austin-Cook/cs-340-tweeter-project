import { AuthenticatedRequest } from "./AuthenticatedRequest";
import { TweeterRequest } from "./TweeterRequest";

export interface LogoutRequest extends TweeterRequest, AuthenticatedRequest  {
}
