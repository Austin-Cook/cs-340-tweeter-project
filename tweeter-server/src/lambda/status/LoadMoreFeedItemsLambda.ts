import { PagedStatusItemRequest, PagedStatusItemResponse, StatusDto } from "tweeter-shared"
import { StatusService } from "../../model/service/StatusService";
import { loadMorePagedItems } from "../util/LoadMorePagedItems";
import { validRequest } from "../util/ValidateInput";
import { getMissingRequestFieldResponse } from "../util/Error";

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
  if (!validRequest(request.token, request.userAlias, request.pageSize, request.lastItem)) {
    return getMissingRequestFieldResponse<PagedStatusItemResponse>();
  }

  const getItems = async (): Promise<[StatusDto[], boolean]> => {
    return await new StatusService().loadMoreFeedItems(request.token, request.userAlias, request.pageSize, request.lastItem);
  }

  return loadMorePagedItems<StatusDto, PagedStatusItemResponse>(getItems);
}
