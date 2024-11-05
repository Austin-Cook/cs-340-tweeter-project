import { PagedUserItemRequest, PagedUserItemResponse, UserDto } from "tweeter-shared"
import { loadMorePagedItems } from "../LoadMorePagedItems";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  const getItems = async (): Promise<[UserDto[], boolean]> => {
    return await new FollowService().loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem);
  }

  return loadMorePagedItems<UserDto, PagedUserItemResponse>(getItems);
}
