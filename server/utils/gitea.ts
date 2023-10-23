export interface Content {
  name: string;
  path: string;
  type: string;
  download_url: string;
  content: string;
}

export async function getContents<T>(filepath?: string): Promise<T> {
  let reqUrl = `https://${process.env.GIT_HOST}/api/v1/repos/${process.env.GIT_OWNER}/${process.env.GIT_REPO}/contents`;
  if (filepath) {
    reqUrl += `/${filepath}`;
  }
  const resp = await fetch(reqUrl, {
    headers: {
      Authorization: `token ${process.env.GIT_TOKEN}`,
    },
  });
  return (await resp.json()) as T;
}
