import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export interface UserNavigationHookObserver {
  displayErrorMessage: (message: string) => void;
  setDisplayedUser: (user: User) => void;
}

export class UserNavigationHookPresenter {
  private _observer: UserNavigationHookObserver;
  private _userService: UserService;

  constructor(observer: UserNavigationHookObserver) {
    this._observer = observer;
    this._userService = new UserService();
  }

  public async navigateToUser(event: React.MouseEvent, currentUser: User | null, authToken: AuthToken | null): Promise<void> {
    event.preventDefault();

    try {
      const alias = this.extractAlias(event.target.toString());

      const user = await this._userService.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this._observer.setDisplayedUser(currentUser!);
        } else {
          this._observer.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this._observer.displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  };
}
