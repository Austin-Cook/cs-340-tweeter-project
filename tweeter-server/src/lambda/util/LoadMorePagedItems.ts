export const loadMorePagedItems = async <DTO, RES>(
  getItems: () => Promise<[DTO[], boolean]>
): Promise<RES> => {
  const [items, hasMore] = await getItems();

  return {
    success: true,
    message: null,
    hasMore: hasMore,
    items
  } as RES
}
