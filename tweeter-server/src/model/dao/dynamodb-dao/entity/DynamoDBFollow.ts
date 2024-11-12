export class DynamoDBFollow {
  public followerHandle: string;
  public followeeHandle: string;
  public followerFirstName: string;
  public followeeFirstName: string;
  public followerLastName: string;
  public followeeLastName: string;
  public followerImgUrl: string;
  public followeeImgUrl: string;

  constructor(
    followerHandle: string,
    followeeHandle: string,
    followerFirstName: string,
    followeeFirstName: string,
    followerLastName: string,
    followeeLastName: string,
    followerImgUrl: string,
    followeeImgUrl: string
  ) {
    this.followerHandle = followerHandle;
    this.followeeHandle = followeeHandle;
    this.followerFirstName = followerFirstName;
    this.followeeFirstName = followeeFirstName;
    this.followerLastName = followerLastName;
    this.followeeLastName = followeeLastName;
    this.followerImgUrl = followerImgUrl;
    this.followeeImgUrl = followeeImgUrl;
  }

  public toString(): string {
    return (
      "\n\nFollow{" +
      "\nfollowerHandle='" +
      this.followerHandle +
      "'" +
      ", \nfolloweeHandle='" +
      this.followeeHandle +
      "'" +
      ", \nfollowerFirstName=" +
      this.followerFirstName +
      "'" +
      ", \nfolloweeFirstName=" +
      this.followeeFirstName +
      "'" +
      ", \nfollowerLastName=" +
      this.followerLastName +
      "'" +
      ", \nfolloweeLastName=" +
      this.followeeLastName +
      "'" +
      ", \nfollowerImgUrl=" +
      this.followerImgUrl +
      "'" +
      ", \nfolloweeImgUrl=" +
      this.followeeImgUrl +
      "}"
    );
  }
}
