import { AuthToken, User } from "tweeter-shared";

export class AppPresenter {
  public isAuthenticated(currentUser: User | null, authToken: AuthToken | null): boolean {
    return !!currentUser && !!authToken;
  };
}
