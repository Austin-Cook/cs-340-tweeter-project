import { AuthTokenDto, UserDto } from "tweeter-shared";

export interface IAuthDao {
  createAuthToken: (authToken: AuthTokenDto, user: UserDto) => Promise<void>;
  renewAuthToken: (token: string, newTimestamp: number) => Promise<void>;
  getUser: (token: string) => Promise<[UserDto, number]>; // [UserDto, timestamp]
  getTimestamp_Soft: (token: string) => Promise<number | null>;
  revokeToken: (token: string) => Promise<void>;
}
