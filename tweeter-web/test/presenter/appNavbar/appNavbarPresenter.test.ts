import { AuthToken } from "tweeter-shared";
import { AppNavbarPresenter, AppNavbarView } from "../../../src/presenter/appNavbar/AppNavbarPresenter";
import { instance, mock, spy, verify, when } from "ts-mockito";
import { UserService } from "../../../src/model/service/UserService";

describe("AppNavbarPresenter", () => {
  let mockAppNavbarView: AppNavbarView;
  let appNavbarPresenter: AppNavbarPresenter;
  let mockUserService: UserService;

  const authToken = new AuthToken("abc", Date.now());
  const errorMessage = "An error occurred";
  const errorMessageFull = "Failed to log user out because of exception: An error occurred"
  const error = new Error(errorMessage);

  beforeEach(() => {
    mockAppNavbarView = mock<AppNavbarView>();
    const mockAppNavbarViewInstance = instance(mockAppNavbarView);

    const appNavbarPresenterSpy = spy(new AppNavbarPresenter(mockAppNavbarViewInstance))
    appNavbarPresenter = instance(appNavbarPresenterSpy);

    mockUserService = mock<UserService>();
    const mockUserServiceInstance = instance(mockUserService);

    when(appNavbarPresenterSpy.userService).thenReturn(mockUserServiceInstance);
  });

  const throwErrorOnServiceLogout = () => {
    when(mockUserService.logout(authToken)).thenThrow(error);
  }

  it("tells the view to display a logging out message", async () => {
    await appNavbarPresenter.logOut(authToken);

    verify(mockAppNavbarView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await appNavbarPresenter.logOut(authToken);

    verify(mockUserService.logout(authToken)).once();
  });

  it("does not tell the view to display an error message on successful logout", async () => {
    await appNavbarPresenter.logOut(authToken);

    verify(mockAppNavbarView.displayErrorMessage(errorMessageFull)).never();
  });

  it("tells the view to clear the last info message on successful logout", async () => {
    await appNavbarPresenter.logOut(authToken);

    verify(mockAppNavbarView.clearLastInfoMessage()).once();
  });

  it("tells the view to clear the user info on successful logout", async () => {
    await appNavbarPresenter.logOut(authToken);

    verify(mockAppNavbarView.clearUserInfo()).once();
  });

  it("tells the view to display an error message when logout is not successful", async () => {
    throwErrorOnServiceLogout();

    await appNavbarPresenter.logOut(authToken);

    verify(mockAppNavbarView.displayErrorMessage(errorMessageFull)).once();
  })

  it("does not tell the view to clear the last info message when logout is not successful", async () => {
    throwErrorOnServiceLogout();

    await appNavbarPresenter.logOut(authToken);

    verify(mockAppNavbarView.clearLastInfoMessage()).never();
  })

  it("does not tell the view to clear the user info when logout is not successful", async () => {
    throwErrorOnServiceLogout();

    await appNavbarPresenter.logOut(authToken);

    verify(mockAppNavbarView.clearUserInfo()).never();
  })
});
