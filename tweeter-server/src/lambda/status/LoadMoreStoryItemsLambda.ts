import { PagedStatusItemRequest, PagedStatusItemResponse, StatusDto } from "tweeter-shared"
import { StatusService } from "../../model/service/StatusService";
import { loadMorePagedItems } from "../util/LoadMorePagedItems";
import { throwBadRequestErrorOnFailure } from "../util/Error";
import { validateRequest, validateStatus_MayBeNull } from "../util/ValidateInput";
import { getDaoFactory } from "../../Config";

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
  return await throwBadRequestErrorOnFailure(async () => {
    validateRequest(request.token, request.userAlias, request.pageSize, request.lastItem);
    validateStatus_MayBeNull(request.lastItem);

    const getItems = async (): Promise<[StatusDto[], boolean]> => {
      return await new StatusService(getDaoFactory()).loadMoreStoryItems(request.token, request.userAlias, request.pageSize, request.lastItem);
    }

    return loadMorePagedItems<StatusDto, PagedStatusItemResponse>(getItems);
  },
    "LoadMoreStoryItemsLambda"
  );
}
