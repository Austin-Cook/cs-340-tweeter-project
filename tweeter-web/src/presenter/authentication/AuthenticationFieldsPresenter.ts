export class AuthenticationFieldsPresenter {
  public onEnter(event: React.KeyboardEvent<HTMLElement>, onEnter: () => Promise<void>,
    checkSubmitButtonStatus: () => boolean) {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      onEnter();
    }
  };
}