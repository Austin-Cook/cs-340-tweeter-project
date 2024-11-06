import {
  AuthToken,
  GetUserRequest,
  GetUserResponse,
  LoginRegisterResponse,
  LoginRequest,
  LogoutRequest,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  Status,
  TweeterRequest,
  TweeterResponse,
  User
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";
import { PagedItemRequest } from "tweeter-shared/dist/model/net/request/PagedItemRequest";
import { PagedItemResponse } from "tweeter-shared/dist/model/net/response/PagedItemResponse";

export class ServerFacade {
  private SERVER_URL = "https://30iqv1twei.execute-api.us-west-2.amazonaws.com/dev";
  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  private static _instance: ServerFacade;

  public static get instance(): ServerFacade {
    if (ServerFacade._instance == null) {
      ServerFacade._instance = new ServerFacade();
    }

    return ServerFacade._instance;
  }

  public async loadMoreFollowers_Server(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    return await this.getMorePagedUserItems(
      request,
      "/user/list-followers",
      "followers"
    );
  }

  public async loadMoreFollowees_Server(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    return await this.getMorePagedUserItems(
      request,
      "/user/list-followees",
      "followees"
    );
  }

  public async loadMoreFeedItems_Server(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    return await this.getMorePagedStatusItems(
      request,
      "/status/list-feed",
      "feed items"
    );
  }

  public async loadMoreStoryItems_Server(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    return await this.getMorePagedStatusItems(
      request,
      "/status/list-story",
      "story items"
    );
  }

  public async postStatus_Server(
    request: PostStatusRequest
  ): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      TweeterResponse
    >(request, "/status/post");

    // Handle errors
    if (!response.success) {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async getUser_Server(
    request: GetUserRequest
  ): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/user/get");

    const user: User | null = response.success && response.user
      ? User.fromDto(response.user)
      : null;

    // Handle errors
    if (response.success) {
      if (user == null) {
        throw new Error(`No user found`);
      } else {
        return user;
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async login_Server(
    request: LoginRequest
  ): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      LoginRegisterResponse
    >(request, "/user/login");

    const user: User | null = response.success && response.user
      ? User.fromDto(response.user)
      : null;
    const authToken: AuthToken | null = response.success && response.authToken
      ? AuthToken.fromDto(response.authToken)
      : null;

    // Handle errors
    if (response.success) {
      if (user == null) {
        throw new Error(`No user found`);
      } else if (authToken == null) {
        throw new Error('No authToken found');
      } else {
        return [user, authToken];
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async logout_server(
    request: LogoutRequest
  ): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      TweeterResponse
    >(request, "/user/logout");

    // Handle errors
    if (!response.success) {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  private async getMorePagedItems<T, REQ extends PagedItemRequest, RES extends PagedItemResponse>(
    request: REQ,
    endpoint: string,
    itemName: string,
    extractItemsFromResponse: (response: RES) => T[] | null
  ): Promise<[T[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      REQ,
      RES
    >(request, endpoint);

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: T[] | null = extractItemsFromResponse(response);

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No ${itemName} found`);
      } else {
        return [items, response.hasMore!];
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  private async getMorePagedUserItems(
    request: PagedUserItemRequest,
    endpoint: string,
    itemName: string,
  ): Promise<[User[], boolean]> {
    const extractItemsFromResponse = (response: PagedUserItemResponse): User[] | null => {
      return response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;
    }

    return await this.getMorePagedItems<User, PagedUserItemRequest, PagedUserItemResponse>(
      request,
      endpoint,
      itemName,
      extractItemsFromResponse
    );
  }

  private async getMorePagedStatusItems(
    request: PagedStatusItemRequest,
    endpoint: string,
    itemName: string,
  ): Promise<[Status[], boolean]> {
    const extractItemsFromResponse = (response: PagedStatusItemResponse): Status[] | null => {
      return response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;
    }

    return await this.getMorePagedItems<Status, PagedStatusItemRequest, PagedStatusItemResponse>(
      request,
      endpoint,
      itemName,
      extractItemsFromResponse
    );
  }
}
