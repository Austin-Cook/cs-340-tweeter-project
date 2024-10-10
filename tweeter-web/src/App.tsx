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
import useUserInfo from "./components/userInfo/UserInfoHook";
import { FolloweePresenter } from "./presenter/mainLayout/FolloweePresenter";
import { FollowerPresenter } from "./presenter/mainLayout/FollowerPresenter";
import { FeedPresenter } from "./presenter/mainLayout/FeedPresenter";
import { StoryPresenter } from "./presenter/mainLayout/StoryPresenter";
import { useState } from "react";
import { AppPresenter } from "./presenter/AppPresenter";
import { PagedItemView } from "./presenter/mainLayout/PagedItemPresenter";
import { Status, User } from "tweeter-shared";
import ItemScroller from "./components/mainLayout/ItemScroller";
import UserItem, { userItemGenerator } from "./components/userItem/UserItem";
import { StatusService } from "./model/service/StatusService";
import StatusItem, { statusItemGenerator } from "./components/statusItem/StatusItem";
import { FollowService } from "./model/service/FollowService";

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
            <ItemScroller
              key={1}
              presenterGenerator={(view: PagedItemView<Status>) => new FeedPresenter(view)}
              itemComponentGenerator={statusItemGenerator}
            />
          }
        />
        <Route
          path="story"
          element={
            <ItemScroller
              key={2}
              presenterGenerator={(view: PagedItemView<Status>) => new StoryPresenter(view)}
              itemComponentGenerator={statusItemGenerator}
            />
          }
        />
        <Route
          path="followees"
          element={
            <ItemScroller
              key={3}
              presenterGenerator={(view: PagedItemView<User>) => new FolloweePresenter(view)}
              itemComponentGenerator={userItemGenerator}
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller
              key={4}
              presenterGenerator={(view: PagedItemView<User>) => new FollowerPresenter(view)}
              itemComponentGenerator={userItemGenerator}
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
