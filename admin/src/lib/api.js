import AXIOS from "./axios";

export const productAPI = {
    getAll: async () => {
        const { data } = await AXIOS.get("/admin/products")
        return data
    },
    create: async ({ formData }) => {
        const { data } = await AXIOS.post("/admin/products", formData)
        return data
    },
    update: async ({ id, formData }) => {
        const { data } = await AXIOS.put(`/admin/products/${id}`, formData)
        return data
    },
    delete: async (id) => {
        const { data } = await AXIOS.delete(`/admin/products/${id}`)
        return data
    },
}

export const orderAPI = {
    getAll: async () => {
        const { data } = await AXIOS.get("/admin/orders")
        return data
    },
    updateStatus: async ({ orderId, status }) => {
        const { data } = await AXIOS.patch(`/admin/orders/${orderId}/status`, status)
        return data
    },
}

export const statsAPI = {
    getDashboard: async () => {
        const { data } = await AXIOS.get("/admin/stats")
        return data
    }
}

export const customerAPI = {
    getAll: async () => {
        const { data } = await AXIOS.get("/admin/customers")
        return data
    }
}