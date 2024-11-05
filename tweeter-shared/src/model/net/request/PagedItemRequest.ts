import { AuthenticatedRequest } from "./AuthenticatedRequest";

export interface PagedItemRequest extends AuthenticatedRequest {
  readonly userAlias: string;
  readonly pageSize: number;
}
