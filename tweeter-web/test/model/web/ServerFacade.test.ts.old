import { PagedUserItemRequest, RegisterRequest, UserActionRequest } from "tweeter-shared";
import { instance, spy } from "ts-mockito";
import { ServerFacade } from "../../../src/model/web/ServerFacade";

describe("ServerFacade", () => {
  let spyServerFacade: ServerFacade;
  let serverFacade: ServerFacade;

  beforeEach(() => {
    spyServerFacade = spy(new ServerFacade());
    serverFacade = instance(spyServerFacade);
  });

  it("returns a user and authtoken after registering", async () => {
    const registerRequest: RegisterRequest = {
      firstName: "firstName",
      lastName: "lastName",
      alias: "alias",
      password: "password",
      userImageBase64: "imageStringBase64",
      imageFileExtension: "imageFileExtension"
    }

    await expect(serverFacade.register_Server(registerRequest)).resolves.not.toThrow();

    const [user, authToken] = await serverFacade.register_Server(registerRequest);
    expect(user).not.toBeNull;
    expect(authToken).not.toBeNull;
    // console.log(user);
    // console.log(authToken);
  });

  it("returns a page of users and a boolean after loading more followers", async () => {
    const loadMoreFollowersRequest: PagedUserItemRequest = {
      token: "token",
      userAlias: "userAlias",
      pageSize: 10,
      lastItem: null
    }

    await expect(serverFacade.loadMoreFollowers_Server(loadMoreFollowersRequest)).resolves.not.toThrow();

    const [users, hasMore] = await serverFacade.loadMoreFollowers_Server(loadMoreFollowersRequest);
    expect(users).not.toBeNull;
    expect(hasMore).not.toBeNull;
    expect(users.length).toBe(10);
    // console.log(users);
    // console.log(hasMore);
  })

  it("returns a number after getting the follower count", async () => {
    const followerCountRequest: UserActionRequest = {
      token: "token",
      user: {
        firstName: "firstName",
        lastName: "lastName",
        alias: "alias",
        imageUrl: "imageUrl"
      }
    }

    await expect(serverFacade.getFollowerCount_Server(followerCountRequest)).resolves.not.toThrow();

    const followerCount = await serverFacade.getFolloweeCount_Server(followerCountRequest);
    expect(followerCount).not.toBeNull;
    // console.log(followerCount);
  })
});
