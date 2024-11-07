import { Buffer } from "buffer";
import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "../web/ServerFacade";

export class UserService {
  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return await ServerFacade.instance.getUser_Server({
      token: authToken.token,
      alias: alias
    });
  };

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const [user, authToken] = await ServerFacade.instance.login_Server({
      alias: alias,
      password: password
    });

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, authToken];
  };

  public async logout(authToken: AuthToken): Promise<void> {
    return await ServerFacade.instance.logout_Server({
      token: authToken.token
    });
  };

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    const [user, authToken] = await ServerFacade.instance.register_Server({
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      userImageBase64: imageStringBase64,
      imageFileExtension: imageFileExtension
    });

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, authToken];
  };

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    return await ServerFacade.instance.getIsFollowerStatus_Server({
      token: authToken.token,
      user: user.dto,
      selectedUser: selectedUser.dto
    });
  };

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return await ServerFacade.instance.getFolloweeCount_Server({
      token: authToken.token,
      user: user.dto
    });
  };

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return await ServerFacade.instance.getFollowerCount_Server({
      token: authToken.token,
      user: user.dto
    });
  };

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    return await ServerFacade.instance.follow_Server({
      token: authToken.token,
      user: userToFollow.dto
    })
  };

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    return await ServerFacade.instance.follow_Server({
      token: authToken.token,
      user: userToUnfollow.dto
    })
  };
}
