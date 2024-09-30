import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import UserItemScroller from "./components/mainLayout/UserItemScroller";
import StatusItemScroller from "./components/mainLayout/SatusItemScroller";
import useUserInfo from "./components/userInfo/UserInfoHook";
import { UserItemView } from "./presenter/mainLayout/UserItemPresenter";
import { FolloweePresenter } from "./presenter/mainLayout/FolloweePresenter";
import { FollowerPresenter } from "./presenter/mainLayout/FollowerPresenter";
import { StatusItemView } from "./presenter/mainLayout/StatusItemPresenter";
import { FeedPresenter } from "./presenter/mainLayout/FeedPresenter";
import { StoryPresenter } from "./presenter/mainLayout/StoryPresenter";
import { useState } from "react";
import { AppPresenter } from "./presenter/AppPresenter";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const [presenter] = useState(new AppPresenter());

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {presenter.isAuthenticated(currentUser, authToken) ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route
          path="feed"
          element={
            <StatusItemScroller
              key={1}
              presenterGenerator={(view: StatusItemView) => new FeedPresenter(view)}
            />
          }
        />
        <Route
          path="story"
          element={
            <StatusItemScroller
              key={2}
              presenterGenerator={(view: StatusItemView) => new StoryPresenter(view)}
            />
          }
        />
        <Route
          path="followees"
          element={
            <UserItemScroller
              key={1}
              presenterGenerator={(view: UserItemView) => new FolloweePresenter(view)}
            />
          }
        />
        <Route
          path="followers"
          element={
            <UserItemScroller
              key={2}
              presenterGenerator={(view: UserItemView) => new FollowerPresenter(view)}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
