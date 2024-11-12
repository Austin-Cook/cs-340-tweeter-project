import { AuthTokenDto, UserDto } from "tweeter-shared";

export interface AuthDao {
  createAuthToken: (alias: string) => Promise<AuthTokenDto>;
  getAuthenticatedUser: (token: string) => Promise<UserDto>;
  revokeToken: (token: string) => Promise<void>;
}
