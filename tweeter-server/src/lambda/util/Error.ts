import { TweeterResponse } from "tweeter-shared";

export const getBadRequestMessage = (message: string): string => {
  return "[Bad Request] " + message;
}

export const getServerErrorMessage = (message: string): string => {
  return "[Server Error] " + message;
}

export const getLambdaFailedMessage = (error: Error, lambdaName: string): string => {
  return getBadRequestMessage(`[${lambdaName}.handler()] failed because of exception: ${(error).message}`);
}

export const getMissingRequestFieldResponse = <RES extends TweeterResponse>(): RES => {
  return getErrorResponse<RES>(getBadRequestMessage("Request missing at least 1 field"));
}

export const getMissingUserFieldResponse = <RES extends TweeterResponse>(): RES => {
  return getErrorResponse<RES>(getBadRequestMessage("User in request missing at least 1 field"));
}

export const getMissingStatusFieldResponse = <RES extends TweeterResponse>(): RES => {
  return getErrorResponse<RES>(getBadRequestMessage("Status in request missing at least 1 field"));
}

export const getErrorResponse = <RES extends TweeterResponse>(message: string): RES => {
  const errorResponse: TweeterResponse = {
    success: false,
    message: message
  };

  return errorResponse as RES;
}

/**
 * Note: This currently doesn't distinguish between 4xx and 5xx messages
 */
export const returnErrorResponseOnFailure = async <RES extends TweeterResponse>(
  operation: () => Promise<RES>,
  lambdaName: string
): Promise<RES> => {
  try {
    return await operation();
  } catch (error) {
    return getErrorResponse<RES>(getLambdaFailedMessage((error as Error), lambdaName));
  }
}
