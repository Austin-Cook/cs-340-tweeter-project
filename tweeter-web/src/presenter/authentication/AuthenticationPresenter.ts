import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { Presenter, View } from "../Presenter";

export interface AuthenticationView extends View {
  updateUserInfo: (currentUser: User, displayedUser: User | null,
    authToken: AuthToken, remember: boolean) => void;
  navigate: (path: string) => void;
}

export class AuthenticationPresenter<T extends AuthenticationView> extends Presenter<T> {
  private _userService: UserService;
  private _isLoading: boolean = false;

  public constructor(view: T) {
    super(view);
    this._userService = new UserService;
  }

  protected get userService() {
    return this._userService;
  }

  public get isLoading() {
    return this._isLoading;
  }

  protected async doAuthentication(
    authenticate: () => Promise<[User, AuthToken]>,
    navigate: () => void,
    rememberMe: boolean,
    operationDescription: string
  ): Promise<void> {
    this.doFailureReportingOperation(
      async () => {
        this._isLoading = true;

        const [user, authToken] = await authenticate();

        this.view.updateUserInfo(user, user, authToken, rememberMe);

        navigate();
      },
      operationDescription,
      () => {
        this._isLoading = false;
      }
    );
  }
}
