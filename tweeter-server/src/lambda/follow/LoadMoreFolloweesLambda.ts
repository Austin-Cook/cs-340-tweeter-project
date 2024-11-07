import { PagedUserItemRequest, PagedUserItemResponse, UserDto } from "tweeter-shared";
import { loadMorePagedItems } from "../util/LoadMorePagedItems";
import { FollowService } from "../../model/service/FollowService";
import { validateUser, validRequest } from "../util/ValidateInput";
import { getMissingRequestFieldResponse, getMissingUserFieldResponse } from "../util/Error";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  if (!validRequest(request.token, request.userAlias, request.pageSize, request.lastItem)) {
    return getMissingRequestFieldResponse<PagedUserItemResponse>();
  }
  if (request.lastItem != null && !validateUser(request.lastItem)) {
    return getMissingUserFieldResponse<PagedUserItemResponse>();
  }

  const getItems = async (): Promise<[UserDto[], boolean]> => {
    return await new FollowService().loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem);
  }

  return loadMorePagedItems<UserDto, PagedUserItemResponse>(getItems);
}
