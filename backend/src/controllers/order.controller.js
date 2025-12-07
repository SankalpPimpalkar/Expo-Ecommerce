import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { Review } from "../models/review.model";

export async function createOrder(req, res) {
    try {
        const user = req.user
        const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body

        if (!orderItems || orderItems.length == 0) {
            return res
                .status(400)
                .json({ message: "No Order Items" })
        }

        for (const item of orderItems) {
            const product = await Product.findById(item.product._id)
            if (!product) {
                return res
                    .status(404)
                    .json({ message: `Product ${item.name} not found` })
            }

            if (product.stock < item.quantity) {
                return res
                    .status(400)
                    .json(`Product ${product.name} is out of stock`)
            }
        }

        const order = await Order.create({
            user: user._id,
            clerkId: user.clerkId,
            orderItems,
            shippingAddress,
            paymentResult,
            totalPrice
        })

        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity }
            })
        }

        return res
            .status(201)
            .json({ message: "Order Created", order })

    } catch (error) {
        console.error("Error in Creating Order", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function getUserOrders(req, res) {
    try {
        const user = req.user
        const orders = await Order.find({ clerkId: user.clerkId })
            .populate("orderItems.product")
            .sort({ createdAt: -1 })

        const ordersWithReviewStatus = await Promise.all(
            orders.map(async (order) => {
                const review = await Review.findOne({ orderId: order._id })
                return {
                    ...order.toObject(),
                    hasReviewed: !!review
                }
            })
        )

        return res
            .status(200)
            .json({ message: "Fetched User Orders", ordersWithReviewStatus })

    } catch (error) {
        console.error("Error in Getting Orders", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}