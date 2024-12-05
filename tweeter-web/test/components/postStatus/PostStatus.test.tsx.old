import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";
import { AuthToken, User } from "tweeter-shared";
import { PostStatusPresenter, PostStatusView } from "../../../src/presenter/postStatus/PostStatusPresenter";
import { anything, instance, mock, spy, verify } from "ts-mockito";

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));

describe("PostStatus Component", () => {
  const post = "abc";
  const currentUser = new User("firstName", "lastName", "@alias", "imageUrl");
  const authToken = new AuthToken("abc", Date.now());

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: currentUser,
      authToken: authToken,
    });
  });

  it("starts with post status button disabled", () => {
    const { postStatusButton } = renderPostStatusAndGetElements();

    expect(postStatusButton).toBeDisabled();
  });

  it("starts with clear button disabled", () => {
    const { clearButton } = renderPostStatusAndGetElements();

    expect(clearButton).toBeDisabled();
  });

  it("enables both buttons when the text field has text", async () => {
    const { postStatusButton, clearButton, postStatusTextArea, user } = renderPostStatusAndGetElements();

    await user.type(postStatusTextArea, "abc");

    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables both buttons when the text field is cleared", async () => {
    const { postStatusButton, clearButton, postStatusTextArea, user } = renderPostStatusAndGetElements();

    await user.type(postStatusTextArea, "abc");
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(postStatusTextArea);
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls the presenter's postStatus method with correct parameters when post status button is pressed", async () => {
    const mockPostStatusView = mock<PostStatusView>();
    const postStatusView = instance(mockPostStatusView);

    // spying is necessary because checkButtonStatus() is needed
    const spyPostStatusPresenter = spy(new PostStatusPresenter(postStatusView));
    const postStatusPresenter = instance(spyPostStatusPresenter);

    const { postStatusButton, postStatusTextArea, user } = renderPostStatusAndGetElements(postStatusPresenter);

    await user.type(postStatusTextArea, post);
    await user.click(postStatusButton);

    verify(spyPostStatusPresenter.submitPost(anything(), post, currentUser, authToken)).once();
  });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
  return render(
    <PostStatus presenter={presenter} />
  );
};

const renderPostStatusAndGetElements = (presenter?: PostStatusPresenter) => {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/ });
  const postStatusTextArea = screen.getByLabelText("postStatusTextArea");

  return { postStatusButton, clearButton, postStatusTextArea, user };
};
