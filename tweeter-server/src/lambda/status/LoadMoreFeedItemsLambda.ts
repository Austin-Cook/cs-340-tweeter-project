import { PagedStatusItemRequest, PagedStatusItemResponse, StatusDto } from "tweeter-shared"
import { StatusService } from "../../model/service/StatusService";
import { loadMorePagedItems } from "../util/LoadMorePagedItems";
import { validateStatus, validRequest } from "../util/ValidateInput";
import { getMissingRequestFieldResponse, getMissingStatusFieldResponse, returnErrorResponseOnFailure } from "../util/Error";
import { getDaoFactory } from "../../Config";

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
  return await returnErrorResponseOnFailure(async () => {
    if (!validRequest(request.token, request.userAlias, request.pageSize, request.lastItem)) {
      return getMissingRequestFieldResponse<PagedStatusItemResponse>();
    }
    if (request.lastItem != null && !validateStatus(request.lastItem)) {
      return getMissingStatusFieldResponse<PagedStatusItemResponse>();
    }
  
    const getItems = async (): Promise<[StatusDto[], boolean]> => {
      return await new StatusService(getDaoFactory()).loadMoreFeedItems(request.token, request.userAlias, request.pageSize, request.lastItem);
    }
  
    return loadMorePagedItems<StatusDto, PagedStatusItemResponse>(getItems);
  },
    "LoadMoreFeedItemsLambda"
  );
}
