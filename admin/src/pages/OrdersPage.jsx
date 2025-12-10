import { orderAPI } from "../lib/api"
import { formatDate } from "../lib/utils"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export default function OrdersPage() {

    const queryClient = useQueryClient()
    const { data: ordersData, isLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: orderAPI.getAll
    })
    const updateStatusMutation = useMutation({
        mutationFn: orderAPI.updateStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] })
            queryClient.invalidateQueries({ queryKey: ["stats"] })
        }
    })
    const orders = ordersData?.orders || []

    const handleStatusChange = (orderId, newStatus) => {
        updateStatusMutation.mutate({ orderId, status: newStatus })
    }


    return (
        <div className="space-y-6">
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold">Orders</h1>
                <p className="text-base-content/70 mt-1">Manage customer orders</p>
            </div>

            <div className="card bg-base-100">
                <div className="card-body">
                    {
                        isLoading ? (
                            <div className="flex justify-center py-12">
                                <span className="loading-spinner loading loading-lg" />
                            </div>
                        ) :
                            orders.length === 0 ? (
                                <div className="text-center py-12 text-base-content/60">
                                    <h5 className="text-xl font-semibold mb-2">
                                        No orders yet
                                    </h5>
                                    <p className="text-sm">
                                        Orders will appear here once customer makes purchases
                                    </p>
                                </div>
                            ) :
                                (
                                    <div className="overflow-x-auto">
                                        <table className="table">
                                            <thead>
                                                <tr>Order ID</tr>
                                                <tr>Customer</tr>
                                                <tr>Items</tr>
                                                <tr>Total</tr>
                                                <tr>Status</tr>
                                                <tr>Date</tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    orders.map(order => {
                                                        const totalQty = order.orderItems.reduce(
                                                            (sum, item) => sum + item.quantity, 0
                                                        )

                                                        return (
                                                            <tr key={order._id}>
                                                                <td>
                                                                    <span className="font-medium">
                                                                        #{order._id.slice(-8).toUpperCase()}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <div className="font-medium">{order.shippingAddress.fullName}</div>
                                                                    <div className="text-sm opacity-60">
                                                                        {order.shippingAddress.city}, {order.shippingAddress.state}
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="font-medium">{totalQty} items</div>
                                                                    <div className="text-sm opacity-60">
                                                                        {order.orderItems[0]?.name}
                                                                        {order.orderItems.length > 1 && ` +${order.orderItems.length - 1} more`}
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <span className="font-semibold">${order.totalPrice.toFixed(2)}</span>
                                                                </td>

                                                                <td>
                                                                    <select
                                                                        value={order.status}
                                                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                                        className="select select-sm"
                                                                        disabled={updateStatusMutation.isPending}
                                                                    >
                                                                        <option value="pending">Pending</option>
                                                                        <option value="shipped">Shipped</option>
                                                                        <option value="delivered">Delivered</option>
                                                                    </select>
                                                                </td>

                                                                <td>
                                                                    <span className="text-sm opacity-60">{formatDate(order.createdAt)}</span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                )
                    }
                </div>
            </div>
        </div>
    )
}
