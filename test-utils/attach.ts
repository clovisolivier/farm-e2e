import type { APIResponse, TestInfo } from "@playwright/test";

export async function attachApiResponse(
  testInfo: TestInfo,
  name: string,
  res: APIResponse
) {
  const status = res.status();
  const headers = await res.headers();
  const bodyText = await res.text();

  await testInfo.attach(`${name}.txt`, {
    body: `status: ${status}\n\nheaders: ${JSON.stringify(headers, null, 2)}\n\nbody:\n${bodyText}`,
    contentType: "text/plain",
  });
}