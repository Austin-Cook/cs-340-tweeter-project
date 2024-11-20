import { TweeterResponse } from "tweeter-shared";

export const getBadRequestMessage = (message: string): string => {
  return "[Bad Request] " + message;
};

export const getServerErrorMessage = (message: string): string => {
  return "[Server Error] " + message;
};

export const getMissingRequestFieldMessage = (): string => {
  return "Request missing at least 1 field";
};

export const getMissingUserFieldMessage = (): string => {
  return "User in request missing at least 1 field";
};

export const getMissingStatusFieldMessage = (): string => {
  return "Status in request missing at least 1 field";
};

export const getLambdaFailedMessage = (error: Error, lambdaName: string): string => {
  return `[${lambdaName}.handler()] failed because of exception: ${(error).message}`;
};

/**
 * Note: This currently doesn't distinguish between 4xx and 5xx messages
 */
export const throwBadRequestErrorOnFailure = async <RES extends TweeterResponse>(
  operation: () => Promise<RES>,
  lambdaName: string
): Promise<RES> => {
  try {
    return await operation();
  } catch (error) {
    throw new Error(getBadRequestMessage(getLambdaFailedMessage((error as Error), lambdaName)));
  }
};
