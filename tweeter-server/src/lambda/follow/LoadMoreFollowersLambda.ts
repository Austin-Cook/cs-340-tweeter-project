import { PagedUserItemRequest, PagedUserItemResponse, UserDto } from "tweeter-shared"
import { FollowService } from "../../model/service/FollowService"
import { loadMorePagedItems } from "../util/LoadMorePagedItems";
import { validateRequest, validateUser_MayBeNull } from "../util/ValidateInput";
import { throwBadRequestErrorOnFailure } from "../util/Error";
import { getDaoFactory } from "../../Config";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  return await throwBadRequestErrorOnFailure(async () => {
    validateRequest(request.token, request.userAlias, request.pageSize, request.lastItem);
    validateUser_MayBeNull(request.lastItem);

    const getItems = async (): Promise<[UserDto[], boolean]> => {
      return await new FollowService(getDaoFactory()).loadMoreFollowers(request.token, request.userAlias, request.pageSize, request.lastItem);
    }

    return loadMorePagedItems<UserDto, PagedUserItemResponse>(getItems);
  },
    "LoadMoreFollowersLambda"
  );
}
