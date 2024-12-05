import { UserDto } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { getDaoFactory } from "../Config";
import { IFollowDao } from "../model/dao/interface/IFollowDao";

const main = async (): Promise<void> => {
  const start = Date.now();

  await new Promise(r => setTimeout(r, 3000));
  // await createUsers();
  // await createFollows();

  const end = Date.now();
  console.log(`Elapsed time: ${(end - start) / 1000} second(s)`);
};

const createUsers = async (): Promise<void> => {
  const users: UserDto[] = [];
  for (let i = 0; i < 10001; i++) {
    users.push({
      firstName: "first" + i,
      lastName: "last" + i,
      alias: "@user" + i,
      imageUrl: "https://tweeter-server-profile-images.s3.us-west-2.amazonaws.com/image/%40alias2.jpeg"
    });
  };

  const userService: UserService = new UserService(getDaoFactory());
  userService.bulkRegister(users);
};

const createFollows = async (): Promise<void> => {
  const followers: UserDto[] = [];
  for (let i = 1; i < 10001; i++) { //1 -> 10001
    followers.push({
      firstName: "first" + i,
      lastName: "last" + i,
      alias: "@user" + i,
      imageUrl: "https://tweeter-server-profile-images.s3.us-west-2.amazonaws.com/image/%40alias2.jpeg"
    });
  };

  const followee: UserDto = {
    firstName: "first0",
    lastName: "last0",
    alias: "@user0",
    imageUrl: "https://tweeter-server-profile-images.s3.us-west-2.amazonaws.com/image/%40alias2.jpeg"
  };

  const followDao: IFollowDao = getDaoFactory().createFollowDao();
  await followDao.bulkFollow(followers, followee);
};

main()
