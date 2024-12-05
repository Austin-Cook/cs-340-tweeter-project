import { PostUpdateFeedRequest, StatusDto, UpdateFeedRequest } from "tweeter-shared";
import { IStatusDao } from "../dao/interface/IStatusDao";
import { AuthService } from "./AuthService";
import { IDaoFactory } from "../dao/factory/IDaoFactory";
import { doFailureReportingOperation } from "../util/FailureReportingOperation";
import { IFollowDao } from "../dao/interface/IFollowDao";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

export class StatusService {
  private readonly _statusDao: IStatusDao;
  private readonly _followDao: IFollowDao;
  private readonly _authService: AuthService;
  private readonly _sqsClient = new SQSClient();
  private readonly _sqsPostStatusQueueUrl = "https://sqs.us-west-2.amazonaws.com/380514329635/TweeterPostStatusQueue";
  private readonly _sqsUpdateFeedQueueUrl = "https://sqs.us-west-2.amazonaws.com/380514329635/TweeterUpdateFeed"

  constructor(daoFactory: IDaoFactory) {
    this._statusDao = daoFactory.createStatusDao();
    this._followDao = daoFactory.createFollowDao();
    this._authService = new AuthService(daoFactory);
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return await doFailureReportingOperation(async () => {
      await this._authService.verifyActiveUser(token);
      await this._authService.renewAuthTokenTimestamp(token);

      return this._statusDao.loadMoreFeedItems(userAlias, pageSize, lastItem === null ? undefined : lastItem);
    },
      "StatusService",
      "loadMoreFeedItems"
    );
  };

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return await doFailureReportingOperation(async () => {
      await this._authService.renewAuthTokenTimestamp(token);

      return this._statusDao.loadMoreStoryItems(userAlias, pageSize, lastItem === null ? undefined : lastItem);
    },
      "StatusService",
      "loadMoreStoryItems"
    );
  };

  // // Note that auth should already have been performed prior to adding to post queue
  // public async postStatus(
  //   token: string,
  //   newStatus: StatusDto
  // ): Promise<void> {
  //   await doFailureReportingOperation(async () => {
  //     await this._authService.verifyAuthenticatedUser(token, newStatus.user.alias); // TODO remove probably
  //     await this._authService.renewAuthTokenTimestamp(token);

  //     // add post to each follower's feed
  //     const followerAliases: string[] = await this._followDao.getAllFollowerAliases(newStatus.user.alias);
  //     await this._statusDao.addStatusesToUsersFeed(followerAliases, newStatus);

  //     await this._statusDao.postStatus(newStatus);
  //   },
  //     "statusService",
  //     "postStatus"
  //   );
  // };

  // Note that auth should already have been performed prior to adding to post queue
  public async postStatusToStory(
    token: string,
    newStatus: StatusDto
  ): Promise<void> {
    await doFailureReportingOperation(async () => {
      // auth performed here - before adding to update feed queue
      await this._authService.verifyAuthenticatedUser(token, newStatus.user.alias);
      await this._authService.renewAuthTokenTimestamp(token);

      await this._statusDao.postStatus(newStatus);
    },
      "statusService",
      "postStatusToStory"
    );
  };

  public async postStatusToFeeds(followerAliases: string[], newStatus: StatusDto) {
    await doFailureReportingOperation(async () => {
      await this._statusDao.addStatusesToUsersFeed(followerAliases, newStatus);
    },
      "statusService",
      "postStatusToFeeds"
    );
  }

  public async addStatusToPostQueue(
    newStatus: StatusDto
  ): Promise<void> {
    await doFailureReportingOperation(async () => {
      const request: PostUpdateFeedRequest = {
        newStatus: newStatus
      }

      const params = {
        DelaySeconds: 0,
        MessageBody: JSON.stringify(request),
        QueueUrl: this._sqsPostStatusQueueUrl,
      };

      const data = await this._sqsClient.send(new SendMessageCommand(params));
      console.log("Success, message sent. MessageID:", data.MessageId);
    },
      "statusService",
      "addStatusToPostQueue"
    );
  }

  public async addStatusToUpdateFeedQueueInGroupsOfFollowers(newStatus: StatusDto): Promise<void> {
    await doFailureReportingOperation(async () => {
      // Note - No auth performed - should have been performed in postStatus lambda
      //        when adding status to poster's story

      const groupSize = 100;

      const followerAliases: string[] = [];
      let newAliases: string[] = [];
      let hasMore = true;
      let lastFollowerAlias: string | undefined = undefined;
      // let i = 0 // DELETEME
      while (hasMore) {
        // if (i > 1) { // FIXME TODO DELETEME
        //   break;
        // }
        // i = i + 1; // DELETEME

        [newAliases, hasMore] = await this._followDao.getGroupOfAliases(newStatus.user.alias, lastFollowerAlias);
        if (!hasMore) {
          break;
        }
        lastFollowerAlias = newAliases[newAliases.length - 1];

        followerAliases.push(...newAliases);

        while (followerAliases.length >= groupSize) {
          let aliasGroup = followerAliases.splice(0, groupSize);

          // TODO don't await this if it isn't fast enough
          await this.addStatusToUpdateFeedQueue({
            followerAliases: aliasGroup,
            newStatus: newStatus
          });
        }
      }

      // add the final group (will be less than groupSize)
      if (followerAliases.length > 0) {
        // TODO don't await this if it isn't fast enough
        await this.addStatusToUpdateFeedQueue({
          followerAliases: followerAliases,
          newStatus: newStatus
        });
      }
    },
      "statusService",
      "addStatusToUpdateFeedQueueInGroupsOfFollowers"
    );
  }

  private async addStatusToUpdateFeedQueue(updateFeedRequest: UpdateFeedRequest) {
    await doFailureReportingOperation(async () => {
      const params = {
        DelaySeconds: 0,
        MessageBody: JSON.stringify(updateFeedRequest),
        QueueUrl: this._sqsUpdateFeedQueueUrl,
      };

      const data = await this._sqsClient.send(new SendMessageCommand(params));
      console.log("Success, message sent. MessageID:", data.MessageId);
    },
      "statusService",
      "addStatusToUpdateFeedQueue"
    );
  }
}
