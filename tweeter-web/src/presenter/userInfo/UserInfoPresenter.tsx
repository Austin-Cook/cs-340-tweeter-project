import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { Dispatch, SetStateAction } from "react";

export interface UserInfoView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
  setIsFollower: Dispatch<SetStateAction<boolean>>;
  setFolloweeCount: Dispatch<SetStateAction<number>>;
  setFollowerCount: Dispatch<SetStateAction<number>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setDisplayedUser: (user: User) => void;
}

export class UserInfoPresenter {
  private _view: UserInfoView;
  private _userService: UserService;

  constructor(view: UserInfoView, currentUser: User | null, displayedUser: User | null) {
    this._view = view;
    this._userService = new UserService();

    if (!displayedUser) {
      this._view.setDisplayedUser(currentUser!);
    }
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this._view.setIsFollower(false);
      } else {
        this._view.setIsFollower(
          await this._userService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  };

  public async setNumbFollowees(
    authToken: AuthToken,
    displayedUser: User
  ) {
    try {
      this._view.setFolloweeCount(await this._userService.getFolloweeCount(authToken, displayedUser));
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  };

  public async setNumbFollowers(
    authToken: AuthToken,
    displayedUser: User
  ) {
    try {
      this._view.setFollowerCount(await this._userService.getFollowerCount(authToken, displayedUser));
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  };

  public switchToLoggedInUser(event: React.MouseEvent, currentUser: User): void {
    event.preventDefault();
    this._view.setDisplayedUser(currentUser!);
  };

  public async followDisplayedUser(
    event: React.MouseEvent, authToken: AuthToken | null, displayedUser: User | null
  ): Promise<void> {
    event.preventDefault();

    try {
      this._view.setIsLoading(true);
      this._view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this._userService.follow(
        authToken!,
        displayedUser!
      );

      this._view.setIsFollower(true);
      this._view.setFollowerCount(followerCount);
      this._view.setFolloweeCount(followeeCount);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this._view.clearLastInfoMessage();
      this._view.setIsLoading(false);
    }
  };

  public async unfollowDisplayedUser(
    event: React.MouseEvent, authToken: AuthToken | null, displayedUser: User | null
  ): Promise<void> {
    event.preventDefault();

    try {
      this._view.setIsLoading(true);
      this._view.displayInfoMessage(
        `Unfollowing ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this._userService.unfollow(
        authToken!,
        displayedUser!
      );

      this._view.setIsFollower(false);
      this._view.setFollowerCount(followerCount);
      this._view.setFolloweeCount(followeeCount);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    } finally {
      this._view.clearLastInfoMessage();
      this._view.setIsLoading(false);
    }
  };
}
