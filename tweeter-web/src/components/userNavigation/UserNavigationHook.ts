import React, { useState } from "react";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import { UserNavigationHookObserver, UserNavigationHookPresenter } from "../../presenter/userNavigation/UserNavigationHookPresenter";

interface UserNavigation {
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
};

const useUserNavigation = (): UserNavigation => {
  const { displayErrorMessage } = useToastListener();
  const { setDisplayedUser, currentUser, authToken } =
    useUserInfo();

  const listener: UserNavigationHookObserver = {
    displayErrorMessage: displayErrorMessage,
    setDisplayedUser: setDisplayedUser
  }

  const [presenter] = useState(new UserNavigationHookPresenter(listener));

  return {
    navigateToUser: async (event: React.MouseEvent): Promise<void> => {
      return presenter.navigateToUser(event, currentUser, authToken);
    }
  };
};

export default useUserNavigation;
