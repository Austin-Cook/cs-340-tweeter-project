import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { Dispatch, SetStateAction } from "react";
import { MessageView, Presenter } from "../Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower: Dispatch<SetStateAction<boolean>>;
  setFolloweeCount: Dispatch<SetStateAction<number>>;
  setFollowerCount: Dispatch<SetStateAction<number>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setDisplayedUser: (user: User) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private _userService: UserService;

  constructor(view: UserInfoView, currentUser: User | null, displayedUser: User | null) {
    super(view);
    this._userService = new UserService();

    if (!displayedUser) {
      this.view.setDisplayedUser(currentUser!);
    }
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    await this.doFailureReportingOperation(
      async () => {
        if (currentUser === displayedUser) {
          this.view.setIsFollower(false);
        } else {
          this.view.setIsFollower(
            await this._userService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
          );
        }
      },
      "determine follower status"
    );
  };

  public async setNumbFollowees(
    authToken: AuthToken,
    displayedUser: User
  ) {
    await this.doFailureReportingOperation(
      async () => {
        this.view.setFolloweeCount(await this._userService.getFolloweeCount(authToken, displayedUser));
      },
      "get followees count"
    );
  };

  public async setNumbFollowers(
    authToken: AuthToken,
    displayedUser: User
  ) {
    await this.doFailureReportingOperation(
      async () => {
        this.view.setFollowerCount(await this._userService.getFollowerCount(authToken, displayedUser));
      },
      "get followers count"
    );
  };

  public switchToLoggedInUser(event: React.MouseEvent, currentUser: User): void {
    event.preventDefault();
    this.view.setDisplayedUser(currentUser!);
  };

  public async followDisplayedUser(
    event: React.MouseEvent, authToken: AuthToken | null, displayedUser: User | null
  ): Promise<void> {
    event.preventDefault();

    await this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

        const [followerCount, followeeCount] = await this._userService.follow(
          authToken!,
          displayedUser!
        );

        this.view.setIsFollower(true);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      "follow user"
    );
    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  };

  public async unfollowDisplayedUser(
    event: React.MouseEvent, authToken: AuthToken | null, displayedUser: User | null
  ): Promise<void> {
    event.preventDefault();

    await this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        this.view.displayInfoMessage(
          `Unfollowing ${displayedUser!.name}...`,
          0
        );

        const [followerCount, followeeCount] = await this._userService.unfollow(
          authToken!,
          displayedUser!
        );

        this.view.setIsFollower(false);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      "unfollow user"
    );
    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  };
}
