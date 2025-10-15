import { fetchPublic } from "@/composable/utils/request"

export const getListMenu = async () => {
    const listMenu = await fetchPublic("/api/menu")
    return listMenu;
}