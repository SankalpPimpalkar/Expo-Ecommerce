import { Order } from "../models/order.model.js"
import { Product } from "../models/product.model.js"
import { Review } from "../models/review.model.js"

export async function createReview(req, res) {
    try {
        const { productId, orderId, rating } = req.body
        const user = req.user

        if (!rating || rating < 1 || rating > 5) {
            return res
                .status(400)
                .json({ message: "Rating should be between 1 to 5" })
        }

        const order = await Order.findById(orderId)
        if (!order) {
            return res
                .status(404)
                .json({ message: "Order not Found" })
        }

        if (order.clerkId !== user.clerkId) {
            return res
                .status(401)
                .json({ message: 'Not Authorized to review this order' })
        }

        if (order.status !== "delivered") {
            return res
                .status(400)
                .json({ message: 'Can only review deliver orders' })
        }

        const productInOrder = order.orderItems.find(item => item.product._id.toString() === productId.toString())

        if (!productInOrder) {
            return res
                .status(400)
                .json({ message: 'Product not found in this order' })
        }

        const review = await Review.create({
            product: productId,
            userId: user._id,
            orderId,
            rating
        })

        const product = await Product.findById(productId)
        const reviews = await Review.find({ product: productId })
        const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0)
        product.averageRating = totalRating / reviews.length
        product.totalReviews = reviews.length
        await product.save()

        return res
            .status(200)
            .json({ message: "Review Submitted", review })

    } catch (error) {
        console.error("Error in Creating Review", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function deleteReview(req, res) {
    try {
        const { reviewId } = req.params
        const user = req.user

        const review = await Review.findById(reviewId)

        if (!review) {
            return res
                .status(404)
                .json({ message: 'Review not Found' })
        }

        if (review.userId.toString() !== user._id.toString()) {
            return res
                .status(401)
                .json({ message: 'You are not authorized to delete this review' })
        }

        const productId = review.product
        await Review.findByIdAndDelete(reviewId)

        const product = await Product.findById(productId)

        if (!product) {
            return res
                .status(404)
                .json({ message: "Product Not Found" })
        }

        const reviews = await Review.find({ product: productId })
        const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0)
        product.averageRating = totalRating / reviews.length
        product.totalReviews = reviews.length
        await product.save()

        return res
            .status(200)
            .json({ message: "Review Deleted" })

    } catch (error) {
        console.error("Error in Deleting Review", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}