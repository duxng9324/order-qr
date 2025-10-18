import { fetchPublic } from "@/composable/utils/request"

export const getListMenu = async () => {
    const listMenu = await fetchPublic("/api/menu")
    return listMenu;
}

export const getMenuItemById = async (id: string) => {
    const menuItem = await fetchPublic(`/api/menu/${id}`)
    return menuItem;
}