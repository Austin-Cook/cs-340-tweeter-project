import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../../model/service/UserService";
import { Presenter, View } from "../../Presenter";

export interface AuthenticationView extends View {
  updateUserInfo: (currentUser: User, displayedUser: User | null,
    authToken: AuthToken, remember: boolean) => void;
  navigate: (path: string) => void;
}

export class LoginPresenter extends Presenter<AuthenticationView> {
  private _userService: UserService;
  private _isLoading: boolean = false;

  constructor(view: AuthenticationView) {
    super(view);
    this._userService = new UserService();
  }

  public get isLoading() {
    return this._isLoading;
  }

  public checkSubmitButtonStatus(alias: string, password: string): boolean {
    return !alias || !password;
  };

  public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl?: string) {
    this.doFailureReportingOperation(async () => {
      this._isLoading = true;

      const [user, authToken] = await this._userService.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    },
      "to log user in"),
      () => {
        this._isLoading = false;
      };
  };
}
