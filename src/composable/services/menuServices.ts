import { fetchPublic, fetchWithJWT } from "../utils/request";

const URL_BASE = process.env.NEXT_PUBLIC_BASE_URL || "";

export async function getMenuItems() {
  return fetchPublic(`${URL_BASE}/api/menu`, "GET");
}

export async function getMenuItemById(id: string) {
  return fetchPublic(`${URL_BASE}/api/menu/${id}`, "GET");
}


export async function createMenuItem(formData: FormData, token: string) {
  const res = await fetch(`${URL_BASE}/api/menu`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.error || "Lỗi khi thêm món!");
  }

  return res.json();
}


export async function updateMenuItem(id: string, data: any, token: string) {
  
  const isFormData = typeof FormData !== "undefined" && data instanceof FormData;

  const res = await fetch(`${URL_BASE}/api/menu/${id}`, {
    method: "PATCH",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token}`,
    },
    body: isFormData ? data : JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.error || "Lỗi khi cập nhật món!");
  }

  return res.json();
}

export async function deleteMenuItem(id: string, token: string) {
  return fetchWithJWT(`${URL_BASE}/api/menu/${id}`, "DELETE", undefined, token);
}
