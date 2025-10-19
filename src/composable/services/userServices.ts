import { fetchPublic, fetchWithJWT } from "../utils/request"

export const getMe = async (token: string) => {
    const me = await fetchWithJWT("/api/me", "GET", undefined ,token);
    return me;
}

export const getUsers = async (token: string) => {
    const users = await fetchPublic("/api/users");
    return users;
}

export const updateUserRole  = async (id: string, data: {role: string}, token: string) => {
    const user = await fetchWithJWT(`/api/users/${id}`, "PATCH", data, token);
    return  user;
}

export const removeUser = async (id: string, token: string) => {
    const user = await fetchWithJWT(`/api/users/${id}`, "DELETE", undefined, token);
    return user;
}