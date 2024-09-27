import { AuthToken } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";

export const PAGE_SIZE = 10;

export class FolloweePresenter extends UserItemPresenter {
  private _followService: FollowService;

  public constructor(view: UserItemView) {
    super(view);
    this._followService = new FollowService();
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    try {
      const [newItems, hasMore] = await this._followService.loadMoreFollowees(
        authToken,
        userAlias,
        PAGE_SIZE,
        this.lastItem
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load followees because of exception: ${error}`
      );
    }
  }
}
