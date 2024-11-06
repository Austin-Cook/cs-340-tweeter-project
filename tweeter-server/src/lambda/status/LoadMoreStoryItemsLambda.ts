import { PagedStatusItemRequest, PagedStatusItemResponse, StatusDto } from "tweeter-shared"
import { StatusService } from "../../model/service/StatusService";
import { loadMorePagedItems } from "../util/LoadMorePagedItems";
import { getMissingRequestFieldResponse, getMissingStatusFieldResponse } from "../util/Error";
import { validateStatus, validRequest } from "../util/ValidateInput";

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
  if (!validRequest(request.token, request.userAlias, request.pageSize, request.lastItem)) {
    return getMissingRequestFieldResponse<PagedStatusItemResponse>();
  }
  if (request.lastItem != null && !validateStatus(request.lastItem)) {
    return getMissingStatusFieldResponse<PagedStatusItemResponse>();
  }

  const getItems = async (): Promise<[StatusDto[], boolean]> => {
    return await new StatusService().loadMoreStoryItems(request.token, request.userAlias, request.pageSize, request.lastItem);
  }

  return loadMorePagedItems<StatusDto, PagedStatusItemResponse>(getItems);
}
