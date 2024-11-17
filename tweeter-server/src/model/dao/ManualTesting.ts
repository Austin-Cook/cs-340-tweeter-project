import { AuthTokenDto, StatusDto, UserDto } from "tweeter-shared"
import { DynamoDBFollowDao } from "./dynamodb-dao/dao/DynamoDBFollowDao"
import { DynamoDBStatusDao } from "./dynamodb-dao/dao/DynamoDBStatusDao";
import { DynamoDBAuthDao } from "./dynamodb-dao/dao/DynamoDBAuthDao";
import { DynamoDBUserDao } from "./dynamodb-dao/dao/DynamoDBUserDao";
import { AuthService } from "../service/AuthService";
import { DynamoDBS3DaoFactory } from "./factory/DynamoDBS3DaoFactory";
import { FollowService } from "../service/FollowService";
import { StatusService } from "../service/StatusService";
import { UserService } from "../service/UserService";

const main = async () => {
  // const user: UserDto = {
  //   firstName: "first",
  //   lastName: "last",
  //   alias: "@alias",
  //   imageUrl: "imgUrl"
  // }

  // const user1: UserDto = {
  //   firstName: "first1",
  //   lastName: "last1",
  //   alias: "@alias1",
  //   imageUrl: "imgUrl1"
  // }

  const followDao: DynamoDBFollowDao = new DynamoDBFollowDao();
  const statusDao: DynamoDBStatusDao = new DynamoDBStatusDao();
  const authDao: DynamoDBAuthDao = new DynamoDBAuthDao();
  const userDao: DynamoDBUserDao = new DynamoDBUserDao();
  const authService: AuthService = new AuthService(DynamoDBS3DaoFactory.instance);
  const followService: FollowService = new FollowService(DynamoDBS3DaoFactory.instance);
  const statusService: StatusService = new StatusService(DynamoDBS3DaoFactory.instance);
  const userService: UserService = new UserService(DynamoDBS3DaoFactory.instance);

  // await followDao.createFollow(user, user1);
  // console.log("Follow created");

  // await followDao.removeFollow(user.alias, user1.alias);
  // console.log("Follow deleted");
  // console.log(await followDao.isFollower(user.alias, user1.alias));

  // console.log("Creating second follow:")
  // await followDao.createFollow(user, user1);


  // await followDao.removeFollow(user.alias, user1.alias);
  // console.log("Follow deleted");

  // console.log("Attempting to delete a 2nd time:");
  // await followDao.removeFollow(user.alias, user1.alias);

  // // 1) put 25 follows (same follower, different followee)
  // for (let i = 0; i < 25; i++) {
  //   const follower: UserDto = {
  //     firstName: "first",
  //     lastName: "last",
  //     alias: "@alias",
  //     imageUrl: "imgUrl"
  //   }

  //   const followee: UserDto = {
  //     firstName: "first" + (i + 1),
  //     lastName: "last" + (i + 1),
  //     alias: "@alias" + (i + 1),
  //     imageUrl: "imgUrl" + (i + 1)
  //   }

  //   await followDao.createFollow(follower, followee);
  // }

  // // 2) put 25 follows (different follower, same followee)
  // for (let i = 0; i < 25; i++) {
  //   const follower: UserDto = {
  //     firstName: "first" + (i + 1),
  //     lastName: "last" + (i + 1),
  //     alias: "@alias" + (i + 1),
  //     imageUrl: "imgUrl" + (i + 1)
  //   }

  //   const followee: UserDto = {
  //     firstName: "first",
  //     lastName: "last",
  //     alias: "@alias",
  //     imageUrl: "imgUrl"
  //   }

  //   await followDao.createFollow(follower, followee);
  // }

  // const [followees, hasMorePages] = await followDao.loadMoreFollowees("@alias", 15, undefined);
  // console.log(
  //   "@alias follows: " +
  //   JSON.stringify(followees) +
  //   ", and are there more pages? " +
  //   hasMorePages
  // );

  // const lastFollowee = followees[followees.length - 1];

  // const [followees2, hasMorePages2] = await followDao.loadMoreFollowees("@alias", 15, lastFollowee);
  // console.log(
  //   "@alias also follows: " +
  //   JSON.stringify(followees2) +
  //   ", and are there more pages? " +
  //   hasMorePages2
  // );

  // const [followers, hasMorePages] = await followDao.loadMoreFollowers("@alias", 15, undefined);
  // console.log(
  //   "@alias is followed by: " +
  //   JSON.stringify(followers) +
  //   ", and are there more pages? " +
  //   hasMorePages
  // );

  // const lastFollower = followers[followers.length - 1];

  // const [followers2, hasMorePages2] = await followDao.loadMoreFollowers("@alias", 15, lastFollower);
  // console.log(
  //   "@alias is also followed by: " +
  //   JSON.stringify(followers2) +
  //   ", and are there more pages? " +
  //   hasMorePages2
  // );

  // const allFollowersAliases = await followDao.getAllFollowerAliases("@alias")
  // console.log(allFollowersAliases)

  // const newStatus: StatusDto = {
  //   post: "post",
  //   user: {
  //     firstName: "first",
  //     lastName: "last",
  //     alias: "@alias3",
  //     imageUrl: "imgUrl"
  //   },
  //   timestamp: Date.now()
  // }

  // // await statusDao.postStatus(newStatus)

  // await statusDao.addStatusToUsersFeed("@alias", newStatus);

  // const [feed, hasMorePages] = await statusDao.loadMoreFeedItems("@alias", 2, undefined);
  // console.log(
  //   "@alias feed: " +
  //   JSON.stringify(feed) +
  //   ", and are there more pages? " +
  //   hasMorePages
  // );

  // const lastStatus = feed[feed.length - 1];

  // const [feed2, hasMorePages2] = await statusDao.loadMoreFeedItems("@alias", 15, lastStatus);
  // console.log(
  //   "@alias also has feed: " +
  //   JSON.stringify(feed2) +
  //   ", and are there more pages? " +
  //   hasMorePages2
  // );

  // await statusDao.postStatus(newStatus);

  // const [story, hasMorePages] = await statusDao.loadMoreStoryItems("@alias", 1, undefined);
  // console.log(
  //   "@alias story: " +
  //   JSON.stringify(story) +
  //   ", and are there more pages? " +
  //   hasMorePages
  // );

  // const lastStatus = story[story.length - 1];

  // const [story2, hasMorePages2] = await statusDao.loadMoreStoryItems("@alias", 15, lastStatus);
  // console.log(
  //   "@alias also has story: " +
  //   JSON.stringify(story2) +
  //   ", and are there more pages? " +
  //   hasMorePages2
  // );

  // const token: AuthTokenDto = {
  //   token: "token1",
  //   timestamp: 0
  // }

  // const user: UserDto = {
  //   firstName: "first",
  //   lastName: "last",
  //   alias: "@alias",
  //   imageUrl: "imgUrl"
  // }

  // await authDao.createAuthToken(token, user);
  // await authDao.renewAuthToken("token", 12343);

  // const [userRes, timestampRes] = await authDao.getAuthenticatedUser("token3");
  // console.log("user: ", JSON.stringify(userRes));
  // console.log("timestamp: ", JSON.stringify(timestampRes));

  // await authDao.revokeToken("token1");

  // console.log(await authDao.getTimestamp_Soft("62b2c0e6-59b6-4599-974a-8a93e7ac0368"));

  // const user: UserDto = {
  //   firstName: "first",
  //   lastName: "last",
  //   alias: "@alias2",
  //   imageUrl: "imgUrl"
  // }

  // await userDao.createUser(user, "passwordHash");

  // const user: UserDto = await userDao.getUser("@alias1");
  // console.log(JSON.stringify(user));

  // const passwordHash: string = await userDao.getSavedPasswordHash("@alias1");
  // console.log(passwordHash);

  // const [numFollowers, numFollowees] = await userDao.getFollowCounts("@alias1");
  // console.log(`${numFollowers}, ${numFollowees}`);

  // await userDao.decrementNumFollowers("@alias");













  // SEVICE TESTS

  // const user: UserDto = {
  //   firstName: "first",
  //   lastName: "last",
  //   alias: "@alias",
  //   imageUrl: "imgUrl"
  // };
  // const password = "password";

  // const authToken: AuthTokenDto = await authService.createAuthToken(user, password);
  // console.log(JSON.stringify(authToken))

  // console.log(authService.hashPassword(password, user.alias))
  // console.log(authService.hashPassword("password1", "alias1"))
  // console.log(authService.match("password1", "alias1", "$2a$10$kctvFiJR1T0X2bAiwJ46m.htZXHIgQn1OBtiClZslp7ZAdqE5W7H2"))

  // console.log(await authService.renewAuthTokenTimestamp("0c9dbf28-4c86-4f59-a76a-0adcdd30eb0b"));
  // await authService.verifyAuthenticatedUser("0c9dbf28-4c86-4f59-a76a-0adcdd30eb0b", user.alias);

  // console.log(await authService.isAuthTokenActive("0c9dbf28-4c86-4f59-a76a-0adcdd30eb0b"));
  // console.log(await authService.renewAuthTokenTimestamp("0c9dbf28-4c86-4f59-a76a-0adcdd30eb0b"));

  // const user: UserDto = await authService.getUserFromToken("0c9dbf28-4c86-4f59-a76a-0adcdd30eb0b")
  // console.log(JSON.stringify(user));

  // const [followers, hasMorePages] = await followService.loadMoreFollowers("token", "@alias", 15, null);
  // console.log(
  //   "@alias is followed by: " +
  //   JSON.stringify(followers) +
  //   ", and are there more pages? " +
  //   hasMorePages
  // );

  // const lastFollower = followers[followers.length - 1];

  // const [followers2, hasMorePages2] = await followService.loadMoreFollowers("token", "@alias", 15, lastFollower);
  // console.log(
  //   "@alias is also followed by: " +
  //   JSON.stringify(followers2) +
  //   ", and are there more pages? " +
  //   hasMorePages2
  // );

  // const [followees, hasMorePages] = await followService.loadMoreFollowees("token", "@alias", 15, null);
  // console.log(
  //   "@alias follows: " +
  //   JSON.stringify(followees) +
  //   ", and are there more pages? " +
  //   hasMorePages
  // );

  // const lastFollowee = followees[followees.length - 1];

  // const [followees2, hasMorePages2] = await followService.loadMoreFollowees("token", "@alias", 15, lastFollowee);
  // console.log(
  //   "@alias also follows: " +
  //   JSON.stringify(followees2) +
  //   ", and are there more pages? " +
  //   hasMorePages2
  // );

  // const [feed, hasMorePages] = await statusService.loadMoreFeedItems("token", "@alias", 2, null);
  // console.log(
  //   "@alias feed: " +
  //   JSON.stringify(feed) +
  //   ", and are there more pages? " +
  //   hasMorePages
  // );

  // const lastStatus = feed[feed.length - 1];

  // const [feed2, hasMorePages2] = await statusService.loadMoreFeedItems("token", "@alias", 15, lastStatus);
  // console.log(
  //   "@alias also has feed: " +
  //   JSON.stringify(feed2) +
  //   ", and are there more pages? " +
  //   hasMorePages2
  // );

  // const [story, hasMorePages] = await statusService.loadMoreStoryItems("0c9dbf28-4c86-4f59-a76a-0adcdd30eb0b", "@alias", 1, null);
  // console.log(
  //   "@alias story: " +
  //   JSON.stringify(story) +
  //   ", and are there more pages? " +
  //   hasMorePages
  // );

  // const lastStatus = story[story.length - 1];

  // const [story2, hasMorePages2] = await statusService.loadMoreStoryItems("0c9dbf28-4c86-4f59-a76a-0adcdd30eb0b", "@alias", 15, lastStatus);
  // console.log(
  //   "@alias also has story: " +
  //   JSON.stringify(story2) +
  //   ", and are there more pages? " +
  //   hasMorePages2
  // );

  // const newStatus: StatusDto = {
  //   post: "hello world2!",
  //   user: {
  //     firstName: "first",
  //     lastName: "last",
  //     alias: "@alias",
  //     imageUrl: "imgUrl"
  //   },
  //   timestamp: Date.now()
  // }

  // await statusService.postStatus("0c9dbf28-4c86-4f59-a76a-0adcdd30eb0b", newStatus);

  // const user: UserDto | null = await userService.getUser("0c9dbf28-4c86-4f59-a76a-0adcdd30eb0b_", "@alias1");
  // console.log(JSON.stringify(user));

  // const [user, authToken] = await userService.login("@alias0", "password");
  // console.log("user", JSON.stringify(user));
  // console.log("authToken", JSON.stringify(authToken));

  // await userService.logout("18b808d4-6408-40ae-9aed-adf10e76f9d6");

  // const follower: UserDto = {
  //   firstName: "first",
  //   lastName: "last",
  //   alias: "@alias",
  //   imageUrl: "imgUrl"
  // }
  // const followee: UserDto = {
  //   firstName: "first",
  //   lastName: "last",
  //   alias: "@alias1",
  //   imageUrl: "imgUrl"
  // }
  // // console.log(await userService.getIsFollowerStatus("token", follower, followee));
  // console.log(await userService.getFolloweeCount("token", follower));
  // console.log(await userService.getFollowerCount("token", follower));

  // const user0Alias = "1c7a8936-6595-4fff-84a3-764580d63ee9";
  // for (let i = 1; i < 6; i++) {
  //   const user: UserDto = {
  //     firstName: "first" + i,
  //     lastName: "last" + i,
  //     alias: "@alias" + i,
  //     imageUrl: "imgUrl" + i
  //   }
  //   // await userDao.createUser(user, authService.hashPassword("password", user.alias));
  //   await userService.follow(user0Alias, user)
  //   // await userService.unfollow(user0Alias, user)
  // }
}

main()
