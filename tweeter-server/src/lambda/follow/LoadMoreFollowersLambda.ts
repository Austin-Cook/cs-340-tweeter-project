import { PagedUserItemRequest, PagedUserItemResponse, UserDto } from "tweeter-shared"
import { FollowService } from "../../model/service/FollowService"
import { loadMorePagedItems } from "../LoadMorePagedItems";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  const getItems = async (): Promise<[UserDto[], boolean]> => {
    return await new FollowService().loadMoreFollowers(request.token, request.userAlias, request.pageSize, request.lastItem);
  }

  return loadMorePagedItems<UserDto, PagedUserItemResponse>(getItems);
}
