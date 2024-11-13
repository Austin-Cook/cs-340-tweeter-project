import { AuthTokenDto, UserDto } from "tweeter-shared";

export interface AuthDao {
  createAuthToken: (authToken: AuthTokenDto, user: UserDto) => Promise<void>;
  getAuthenticatedUser: (token: string) => Promise<[UserDto, number]>;
  revokeToken: (token: string) => Promise<void>;
}
