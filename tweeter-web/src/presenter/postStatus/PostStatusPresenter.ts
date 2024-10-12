import { Dispatch, SetStateAction } from "react";
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { MessageView, Presenter } from "../Presenter";

export interface PostStatusView extends MessageView {
  setPost: Dispatch<SetStateAction<string>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _statusService: StatusService;

  constructor(view: PostStatusView) {
    super(view);
    this._statusService = new StatusService();
  }

  public get statusService() {
    return this._statusService;
  }

  public async submitPost(event: React.MouseEvent, post: string, currentUser: User | null,
    authToken: AuthToken | null) {
    event.preventDefault();

    await this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        this.view.displayInfoMessage("Posting status...", 0);

        const status = new Status(post, currentUser!, Date.now());

        await this.statusService.postStatus(authToken!, status);

        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      },
      "post the status"
    );
    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  };

  public clearPost(event: React.MouseEvent) {
    event.preventDefault();
    this.view.setPost("");
  };

  public checkButtonStatus(post: string, currentUser: User | null, authToken: AuthToken | null)
    : boolean {
    return !post.trim() || !authToken || !currentUser;
  };
}
