import { anything, capture, instance, mock, spy, verify, when } from "ts-mockito";
import { PostStatusPresenter, PostStatusView } from "../../../src/presenter/postStatus/PostStatusPresenter";
import React from "react";
import { AuthToken, User } from "tweeter-shared";
import { StatusService } from "../../../src/model/service/StatusService";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let mockStatusService: StatusService;
  let postStatusPresenter: PostStatusPresenter;
  let event: React.MouseEvent;

  const post = "New post";
  const currentUser = new User("firstName", "lastName", "alias", "imgUrl");
  const authToken = new AuthToken("token", Date.now());
  const errorMessage = "An error occurred";
  const errorMessageFull = "Failed to post the status because of exception: An error occurred"
  const error = new Error(errorMessage);

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const postStatusView = instance(mockPostStatusView);

    const spyPostStatusPresenter = spy(new PostStatusPresenter(postStatusView));
    postStatusPresenter = instance(spyPostStatusPresenter);

    mockStatusService = mock<StatusService>();
    const statusService = instance(mockStatusService);

    when(spyPostStatusPresenter.statusService).thenReturn(statusService);

    event = {
      preventDefault: jest.fn(),
    } as unknown as React.MouseEvent;
  });

  const throwErrorOnServicePost = () => {
    when(mockStatusService.postStatus(anything(), anything())).thenThrow(error);
  };

  it("tells the view to display a posting status message", () => {
    postStatusPresenter.submitPost(event, post, currentUser, authToken);

    verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
  });

  it("calls postStatus on the poststatus service with the correct status string and auth token", () => {
    postStatusPresenter.submitPost(event, post, currentUser, authToken);

    verify(mockStatusService.postStatus(authToken, anything())).once();

    const [authTokenArg, newStatusArg] = capture(mockStatusService.postStatus).last();

    expect(authTokenArg).toEqual(authToken);
    expect(newStatusArg.post).toEqual(post);
  });

  it("tells the view to clear the last info message when posting the status is successful", async () => {
    await postStatusPresenter.submitPost(event, post, currentUser, authToken);

    verify(mockPostStatusView.clearLastInfoMessage()).once();
  });

  it("tells the view to clear the post when posting the status is successful", async () => {
    await postStatusPresenter.submitPost(event, post, currentUser, authToken);

    verify(mockPostStatusView.setPost("")).once();
  });

  it("tells the view to display a status posted message when posting the status is successful", async () => {
    await postStatusPresenter.submitPost(event, post, currentUser, authToken);

    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
  });

  it("tells the view to display an error message when posting the status is not successful", async () => {
    throwErrorOnServicePost();

    await postStatusPresenter.submitPost(event, post, currentUser, authToken);

    verify(mockPostStatusView.displayErrorMessage(errorMessageFull)).once();
  });

  it("tells the view to clear the last info message when posting the status is not successful", async () => {
    throwErrorOnServicePost();

    await postStatusPresenter.submitPost(event, post, currentUser, authToken);

    verify(mockPostStatusView.clearLastInfoMessage()).once();
  });

  it("does not tell the view to clear the post when posting the status is not successful", async () => {
    throwErrorOnServicePost();

    await postStatusPresenter.submitPost(event, post, currentUser, authToken);

    verify(mockPostStatusView.setPost("")).never();
  });

  it("does not tell the view to display a status posted message when posting the status is not successful", async () => {
    throwErrorOnServicePost();

    await postStatusPresenter.submitPost(event, post, currentUser, authToken);

    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never();
  });
});