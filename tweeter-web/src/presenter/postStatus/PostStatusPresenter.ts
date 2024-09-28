import { Dispatch, SetStateAction } from "react";
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export interface PostStatusView {
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
  displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => void;
  clearLastInfoMessage: () => void;
  setPost: Dispatch<SetStateAction<string>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export class PostStatusPresenter {
  private _view: PostStatusView;
  private _statusService: StatusService;

  constructor(view: PostStatusView) {
    this._view = view;
    this._statusService = new StatusService();
  }

  public async submitPost(event: React.MouseEvent, post: string, currentUser: User | null,
    authToken: AuthToken | null) {
    event.preventDefault();

    try {
      this._view.setIsLoading(true);
      this._view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this._statusService.postStatus(authToken!, status);

      this._view.setPost("");
      this._view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this._view.clearLastInfoMessage();
      this._view.setIsLoading(false);
    }
  };

  public clearPost(event: React.MouseEvent) {
    event.preventDefault();
    this._view.setPost("");
  };

  public checkButtonStatus(post: string, currentUser: User | null, authToken: AuthToken | null)
    : boolean {
    return !post.trim() || !authToken || !currentUser;
  };
}
