import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../../model/service/UserService";

export interface LoginView {
  updateUserInfo: (currentUser: User, displayedUser: User | null,
    authToken: AuthToken, remember: boolean) => void;
  navigate: (path: string) => void;
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
}

export class LoginPresenter {
  private _view: LoginView;
  private _userService: UserService;
  private _isLoading: boolean = false;

  constructor(view: LoginView) {
    this._view = view;
    this._userService = new UserService();
  }

  public get isLoading() {
    return this._isLoading;
  }

  public checkSubmitButtonStatus(alias: string, password: string): boolean {
    return !alias || !password;
  };

  public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl?: string) {
    try {
      this._isLoading = true;

      const [user, authToken] = await this._userService.login(alias, password);

      this._view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this._view.navigate(originalUrl);
      } else {
        this._view.navigate("/");
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this._isLoading = false;
    }
  };
}
