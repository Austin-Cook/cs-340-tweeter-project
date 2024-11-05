import { PagedUserItemRequest, PagedUserItemResponse, UserDto } from "tweeter-shared";
import { loadMorePagedItems } from "../util/LoadMorePagedItems";
import { FollowService } from "../../model/service/FollowService";
import { validRequest } from "../util/ValidateInput";
import { getMissingRequestFieldResponse } from "../util/Error";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  if (!validRequest(request.token, request.userAlias, request.pageSize, request.lastItem)) {
    return getMissingRequestFieldResponse<PagedUserItemResponse>();
  }

  const getItems = async (): Promise<[UserDto[], boolean]> => {
    return await new FollowService().loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem);
  }

  return loadMorePagedItems<UserDto, PagedUserItemResponse>(getItems);
}
