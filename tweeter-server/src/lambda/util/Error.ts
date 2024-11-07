import { TweeterResponse } from "tweeter-shared";

export const getBadRequestMessage = (message: string): string => {
  return "[Bad Request] " + message;
}

export const getServerErrorMessage = (message: string): string => {
  return "[Server Error] " + message;
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
