import { AuthToken } from "tweeter-shared";
import { instance, spy } from "ts-mockito";
import { StatusService } from "../../../src/model/service/StatusService"

describe("StatusService", () => {
  let spyStatusService: StatusService;
  let statusService: StatusService;

  beforeEach(() => {
    spyStatusService = spy(new StatusService());
    statusService = instance(spyStatusService);
  });

  it("returns a page of stories and a boolean after loading more stories", async () => {
    const authToken = new AuthToken("token", 1234);
    const alias = "@alias";
    const pageSize = 10;
    const lastItem = null;

    await expect(statusService.loadMoreStoryItems(authToken, alias, pageSize, lastItem)).resolves.not.toThrow();

    const [statuses, hasMore] = await statusService.loadMoreStoryItems(authToken, alias, pageSize, lastItem);
    expect(statuses).not.toBeNull;
    expect(hasMore).not.toBeNull;
    expect(statuses.length).toBe(10);
    // console.log(statuses);
    // console.log(hasMore);
  });
});
