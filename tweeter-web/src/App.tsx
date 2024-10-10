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
import UserItem from "./components/userItem/UserItem";
import { StatusService } from "./model/service/StatusService";
import StatusItem from "./components/statusItem/StatusItem";
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
            <ItemScroller<Status, FeedPresenter, StatusService>
              key={1}
              presenterGenerator={(view: PagedItemView<Status>) => new FeedPresenter(view)}
              itemComponentGenerator={(item: Status) => <StatusItem value={item} />}
            />
          }
        />
        <Route
          path="story"
          element={
            <ItemScroller<Status, StoryPresenter, StatusService>
              key={2}
              presenterGenerator={(view: PagedItemView<Status>) => new StoryPresenter(view)}
              itemComponentGenerator={(item: Status) => <StatusItem value={item} />}
            />
          }
        />
        <Route
          path="followees"
          element={
            <ItemScroller<User, FolloweePresenter, FollowService>
              key={3}
              presenterGenerator={(view: PagedItemView<User>) => new FolloweePresenter(view)}
              itemComponentGenerator={(item: User) => <UserItem value={item} />}
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller<User, FollowerPresenter, FollowService>
              key={4}
              presenterGenerator={(view: PagedItemView<User>) => new FollowerPresenter(view)}
              itemComponentGenerator={(item: User) => <UserItem value={item} />}
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
