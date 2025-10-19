import { fetchPublic, fetchWithJWT } from "../utils/request"

export const getTableById = async (tableId: string) => {
    const table = await fetchPublic(`/api/table/${tableId}`)
    return table;
}

export const getTables = async () => {
    const tables = await fetchPublic("/api/table");
    return tables;
}

export const removeTable = async (tableId: string | number, token: string | undefined) => {
    const table = await fetchWithJWT(`/api/table/${tableId}`, "DELETE", undefined, token);
    return table;
}

export const creatTable = async (data : {name: string}, token: string | undefined) => {
    const table = await fetchWithJWT("/api/table", "POST", data, token);
    return table;
}