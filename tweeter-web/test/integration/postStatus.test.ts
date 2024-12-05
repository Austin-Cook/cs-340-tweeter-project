import { anything, capture, instance, mock, spy, verify, when } from "ts-mockito";
import { PostStatusPresenter, PostStatusView } from "../../src/presenter/postStatus/PostStatusPresenter";
import React from "react";
import { AuthToken, StatusDto, User } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";
import { UserService } from "../../src/model/service/UserService";

describe("PostStatus", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let statusService: StatusService;
  let event: React.MouseEvent;

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const postStatusView = instance(mockPostStatusView);

    const spyPostStatusPresenter = spy(new PostStatusPresenter(postStatusView));
    postStatusPresenter = instance(spyPostStatusPresenter);

    statusService = new StatusService();

    when(spyPostStatusPresenter.statusService).thenReturn(statusService);

    event = {
      preventDefault: jest.fn(),
    } as unknown as React.MouseEvent;
  });

  it("correctly posts a status", async () => {
    // 1. Login a user. [This can be done by directly accessing the ServerFacade or client side service class]
    const alias = "@postStatusIntegrationTest";
    const password = "password";

    const userService = new UserService()
    const [user, authToken] = await userService.login(alias, password);

    // 2. Post a status from the user to the server by calling the "post status" operation on the relevant Presenter.
    const post = `Message ${Date.now()}`;
    await postStatusPresenter.submitPost(event, post, user, authToken);

    // 3. Verify that the "Successfully Posted!" message was displayed to the user.
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();

    // 4. Retrieve the user's story from the server to verify that the new status was correctly appended to the user's story, and that all status details are correct. 
    // [This can be done by directly accessing the ServerFacade or client side service class]
    const [statuses, hasMore] = await statusService.loadMoreStoryItems(authToken, user.alias, 1000, null);
    expect(statuses.length).toBeGreaterThan(0);

    const actualStatus = statuses[statuses.length - 1];

    expect(actualStatus.post).toEqual(post);
    expect(actualStatus.user.alias).toEqual(alias);
  },
    15000
  );
});
