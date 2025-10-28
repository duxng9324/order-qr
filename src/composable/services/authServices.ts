import { fetchPublic } from "../utils/request";

export const login = async ({ email, password }: { email: string, password: string }) => {
  const response = await fetchPublic("/api/auth/login", "POST", { email, password });
  return response;
};

export const register = async ({name, email, phone, password}: {name: string, email: string, phone: string, password: string}) => {
  const response = await fetchPublic("/api/auth/register", "POST", {name, email, phone, password})
  return response;
} 