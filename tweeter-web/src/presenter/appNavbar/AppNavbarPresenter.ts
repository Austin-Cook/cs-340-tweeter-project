import { AuthToken } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export interface AppNavbarView {
  clearUserInfo: () => void;
  displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => void;
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
  clearLastInfoMessage: () => void;
}

export class AppNavbarPresenter {
  private _view: AppNavbarView;
  private _userService: UserService;

  constructor(view: AppNavbarView) {
    this._view = view;
    this._userService = new UserService();
  }

  public async logOut(authToken: AuthToken | null) {
    this._view.displayInfoMessage("Logging Out...", 0);

    try {
      await this._userService.logout(authToken!);

      this._view.clearLastInfoMessage();
      this._view.clearUserInfo();
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  };
}
