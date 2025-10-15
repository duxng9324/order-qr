import { fetchPublic } from "../utils/request"

export const getTableById = async (tableId: string) => {
    const table = await fetchPublic(`/api/table/${tableId}`)
    return table;
}