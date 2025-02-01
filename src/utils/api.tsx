import { getCookie } from "cookies-next/client";

type CallApiMethod = "GET" | "POST" | "PUT" | "DELETE";

export async function callApi(
  url: string,
  { method, body }: { method: CallApiMethod; body?: any }
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const token = getCookie("token");
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    headers,
    method,
    body: JSON.stringify(body),
  });
}
