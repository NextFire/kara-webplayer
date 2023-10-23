import { Content } from "~/server/utils/gitea";

export default defineEventHandler((event) => {
  const query = getQuery(event);
  return getContents<Content[]>(query.filepath as string | undefined);
});
