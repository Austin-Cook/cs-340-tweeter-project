import { AuthToken, Status } from "tweeter-shared";

// observer interface
export interface StatusItemView {
  addItems: (newItems: Status[]) => void;
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
}

export abstract class StatusItemPresenter {
  private _view: StatusItemView;
  private _hasMoreItems: boolean = true;
  private _lastItem: Status | null = null;

  constructor(view: StatusItemView) {
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

  protected set lastItem(value: Status | null) {
    this._lastItem = value;
  }

  public reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }
}
