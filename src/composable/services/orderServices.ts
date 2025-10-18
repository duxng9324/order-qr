import { fetchPublic } from "../utils/request"

export const createOrder = async (data: any) => {
    const order = await fetchPublic('/api/order', "POST", data);
    return order;
}

export const getOrderById = async (orderId: string) => {
    const order = await fetchPublic(`/api/order/${orderId}`);
    return order;
}