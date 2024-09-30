import { AuthToken, User } from "tweeter-shared";

// observer interface
export interface UserItemView {
  addItems: (newItems: User[]) => void;
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
}

export abstract class UserItemPresenter {
  private _view: UserItemView;
  private _hasMoreItems = true;
  private _lastItem: User | null = null;

  protected constructor(view: UserItemView) {
    this._view = view;
  }

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;

  protected get view() {
    return this._view;
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected get lastItem() {
    return this._lastItem;
  }

  protected set lastItem(value: User | null) {
    this._lastItem = value;
  }

  public reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }
}
