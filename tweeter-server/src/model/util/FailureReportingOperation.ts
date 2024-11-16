export const doFailureReportingOperation = async <RET>(
  operation: () => Promise<RET>,
  daoName: string,
  daoMethod: string
): Promise<RET> => {
  try {
    return await operation();
  } catch (error) {
    throw getError(error as Error, daoName, daoMethod);
  }
}

export const doFailureReportingOperation_Sync = <RET>(
  operation: () => RET,
  daoName: string,
  daoMethod: string
): RET => {
  try {
    return operation();
  } catch (error) {
    throw getError(error as Error, daoName, daoMethod);
  }
}

const getError = (error: Error, daoName: string, daoMethod: string): Error => {
  return new Error(`\n[${daoName}.${daoMethod}()] failed because of exception: ${(error as Error).message}`)
}
