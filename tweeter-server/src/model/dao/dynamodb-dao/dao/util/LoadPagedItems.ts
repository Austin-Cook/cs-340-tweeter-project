import { DynamoDBDocumentClient, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { doFailureReportingOperation } from "../../../../util/FailureReportingOperation";

export const loadPagedItems = async <DTO, ROW>(client: DynamoDBDocumentClient, params: QueryCommandInput, buildDto: (items: ROW) => DTO, daoName: string, daoMethod: string) => {
  return await doFailureReportingOperation(async (): Promise<[DTO[], boolean]> => {
    const items: DTO[] = [];
    const data = await client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => {
      const dto: DTO = buildDto(item as ROW);
      items.push(
        dto
      )
    });

    return [items, hasMorePages];
  },
    daoName,
    daoMethod
  );
}
