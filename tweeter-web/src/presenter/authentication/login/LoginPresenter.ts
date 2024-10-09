import { AuthenticationPresenter, AuthenticationView } from "../AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter<AuthenticationView> {
  public checkSubmitButtonStatus(alias: string, password: string): boolean {
    return !alias || !password;
  };

  public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl?: string)
    : Promise<void> {
    this.doAuthentication(
      async () => {
        return this.userService.login(alias, password)
      },
      () => {
        if (!!originalUrl) {
          this.view.navigate(originalUrl);
        } else {
          this.view.navigate("/");
        }
      },
      rememberMe,
      "log user in"
    );
  };
}
