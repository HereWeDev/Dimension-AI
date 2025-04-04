export async function api(
  path: string,
  data: unknown,
  method: string,
  to: string = String(process.env.NEXT_PUBLIC_API_ORIGIN)
) {
  const response = await fetch(to + path, {
    credentials: "include",
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}
