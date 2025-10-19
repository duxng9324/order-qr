import { fetchPublic, fetchWithJWT } from "../utils/request"

export const createOrder = async (data: any) => {
    const order = await fetchPublic('/api/order', "POST", data);
    return order;
}

export const getOrderById = async (orderId: string) => {
    const order = await fetchPublic(`/api/order/${orderId}`);
    return order;
}

export const getOrders = async (token: string) => {
    const orders = await fetchWithJWT(`/api/order`, "GET", undefined, token)
    return orders;
}

export const statusChange = async (id: string, data: {status: string}, token: string) => {
    const order = await fetchWithJWT(`/api/order/${id}`, "PATCH", data, token);
    return order;
}