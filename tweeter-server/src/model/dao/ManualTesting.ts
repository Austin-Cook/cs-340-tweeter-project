import { AuthTokenDto, StatusDto, UserDto } from "tweeter-shared"
import { DynamoDBFollowDao } from "./dynamodb-dao/dao/DynamoDBFollowDao"
import { DynamoDBStatusDao } from "./dynamodb-dao/dao/DynamoDBStatusDao";
import { DynamoDBAuthDao } from "./dynamodb-dao/dao/DynamoDBAuthDao";
import { DynamoDBUserDao } from "./dynamodb-dao/dao/DynamoDBUserDao";

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

  const newStatus: StatusDto = {
    post: "post",
    user: {
      firstName: "first",
      lastName: "last",
      alias: "@alias3",
      imageUrl: "imgUrl"
    },
    timestamp: Date.now()
  }

  // // await statusDao.postStatus(newStatus)

  // await statusDao.addStatusToUsersFeed("@alias", newStatus);

  const [feed, hasMorePages] = await statusDao.loadMoreFeedItems("@alias", 2, undefined);
  console.log(
    "@alias feed: " +
    JSON.stringify(feed) +
    ", and are there more pages? " +
    hasMorePages
  );

  const lastStatus = feed[feed.length - 1];

  const [feed2, hasMorePages2] = await statusDao.loadMoreFeedItems("@alias", 15, lastStatus);
  console.log(
    "@alias also has feed: " +
    JSON.stringify(feed2) +
    ", and are there more pages? " +
    hasMorePages2
  );

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
  //   token: "token2",
  //   timestamp: 0
  // }

  // const user: UserDto = {
  //   firstName: "first",
  //   lastName: "last",
  //   alias: "@alias",
  //   imageUrl: "imgUrl"
  // }

  // await authDao.createAuthToken(token, user);

  // const [userRes, timestampRes] = await authDao.getAuthenticatedUser("token3");
  // console.log("user: ", JSON.stringify(userRes));
  // console.log("timestamp: ", JSON.stringify(timestampRes));

  // await authDao.revokeToken("token1");

  // const user: UserDto = {
  //   firstName: "first",
  //   lastName: "last",
  //   alias: "@alias",
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
}

main()
