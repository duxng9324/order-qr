const URL_BASE = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchWithJWT<T = any>(
  endpoint: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
  body?: any,
  token?: string
): Promise<T> {
  const res = await fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Lỗi khi gọi API có JWT");
  }

  return res.json();
}

export async function fetchPublic<T = any>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any
): Promise<T> {
  const res = await fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Lỗi khi gọi API không cần JWT");
  }

  return res.json();
}