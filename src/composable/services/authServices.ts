import { fetchPublic } from "../utils/request";

export const login = async ({ email, password }: { email: string, password: string }) => {
  const response = await fetchPublic("/api/auth/login", "POST", { email, password });
  return response;
};
