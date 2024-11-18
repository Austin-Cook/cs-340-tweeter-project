import { PagedUserItemRequest, PagedUserItemResponse, UserDto } from "tweeter-shared"
import { FollowService } from "../../model/service/FollowService"
import { loadMorePagedItems } from "../util/LoadMorePagedItems";
import { validateUser, validRequest } from "../util/ValidateInput";
import { getMissingRequestFieldResponse, getMissingUserFieldResponse, returnErrorResponseOnFailure } from "../util/Error";
import { getDaoFactory } from "../../Config";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  return await returnErrorResponseOnFailure(async () => {
    if (!validRequest(request.token, request.userAlias, request.pageSize, request.lastItem)) {
      return getMissingRequestFieldResponse<PagedUserItemResponse>();
    }
    if (request.lastItem != null && !validateUser(request.lastItem)) {
      return getMissingUserFieldResponse<PagedUserItemResponse>();
    }

    const getItems = async (): Promise<[UserDto[], boolean]> => {
      return await new FollowService(getDaoFactory()).loadMoreFollowers(request.token, request.userAlias, request.pageSize, request.lastItem);
    }

    return loadMorePagedItems<UserDto, PagedUserItemResponse>(getItems);
  },
    "LoadMoreFollowersLambda"
  );
}
