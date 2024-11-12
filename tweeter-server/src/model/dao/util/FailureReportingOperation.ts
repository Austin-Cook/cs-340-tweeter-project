export const doFailureReportingOperation = async <RET>(
  operation: () => Promise<RET>,
  daoName: string,
  daoMethod: string
): Promise<RET> => {
  try {
    return await operation();
  } catch (error) {
    throw new Error(`[${daoName}.${daoMethod}()] failed because of exception: ${(error as Error).message}`);
  }
}
