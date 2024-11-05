import { PagedStatusItemRequest, PagedStatusItemResponse, StatusDto } from "tweeter-shared"
import { StatusService } from "../../model/service/StatusService";
import { loadMorePagedItems } from "../LoadMorePagedItems";

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
  const getItems = async (): Promise<[StatusDto[], boolean]> => {
    return await new StatusService().loadMoreStoryItems(request.token, request.userAlias, request.pageSize, request.lastItem);
  }

  return loadMorePagedItems<StatusDto, PagedStatusItemResponse>(getItems);
}
