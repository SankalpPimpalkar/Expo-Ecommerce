import cloudinary from "../config/cloudinary.js"
import { Order } from "../models/order.model.js"
import { Product } from "../models/product.model.js"
import { User } from "../models/user.model.js"

export async function createProduct(req, res) {
    try {
        const { name, description, price, stock, category } = req.body

        if (!name || !description || !price || !stock || !category) {
            return res
                .status(400)
                .json({ message: "All Fields are required" })
        }

        if (!req.files || req.files.length === 0) {
            return res
                .status(400)
                .json({ message: "Atleast one product image is required" })
        }

        if (req.files.length > 3) {
            return res
                .status(400)
                .json({ message: "Only at max 3 images allowed for product" })
        }

        const uploadPromises = req.files.map((file) => {
            return cloudinary.uploader.upload(file.path, {
                folder: "products"
            })
        })

        const uploadResults = await Promise.all(uploadPromises)
        const imageUrls = uploadResults.map((result) => result.secure_url)

        const product = await Product.create({
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            category,
            images: imageUrls,
        })

        return res
            .status(201)
            .json({ message: "Product Created", product })

    } catch (error) {
        console.error("Error in Creating Product", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function getAllProducts(req, res) {
    try {
        const products = await Product.find().sort({ createdAt: -1 })

        return res
            .status(200)
            .json({ message: "Fetched All Products", products })

    } catch (error) {
        console.error("Error in Getting Products", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function updateProduct(req, res) {
    try {
        const { productId } = req.params
        const { name, description, price, stock, category } = req.body

        const product = await Product.findById(productId)

        if (!product) {
            return res
                .status(404)
                .json({ message: "Product Not Found" })
        }

        if (name) product.name = name.trim()
        if (description) product.description = description.trim()
        if (category) product.category = category.trim()
        if (price !== undefined) product.price = parseFloat(price)
        if (stock !== undefined) product.stock = parseInt(stock)


        if (req.files && req.files.length > 0) {
            if (req.files.length > 3) {
                return res
                    .status(400)
                    .json({ message: "Only at max 3 images allowed for product" })
            }

            const uploadPromises = req.files.map((file) => {
                return cloudinary.uploader.upload(file.path, {
                    folder: "products"
                })
            })

            const uploadResults = await Promise.all(uploadPromises)
            product.images = uploadResults.map((result) => result.secure_url)
        }

        await product.save()

        return res
            .status(200)
            .json({ message: "Product Updated", product })

    } catch (error) {
        console.error("Error in Updating Product", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function deleteProduct(req, res) {
    try {
        const { productId } = req.params

        await Product.findByIdAndDelete(productId)

        return res
            .status(200)
            .json({ message: "Product Deleted" })

    } catch (error) {
        console.error("Error in Deleting Product", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function getAllOrders(req, res) {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("orderItems.product")
            .sort({ createdAt: -1 })

        return res
            .status(200)
            .json({ message: "All Orders Fetched", orders })

    } catch (error) {
        console.error("Error in Getting All Orders", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function updateOrderStatus(req, res) {
    try {
        const { orderId } = req.params
        const { status } = req.body

        if (!["pending", "shipped", "delivered"].includes(status)) {
            return res
                .status(400)
                .json({ message: "Invalid Status" })
        }

        const order = await Order.findById(orderId)

        if (!order) {
            return res
                .status(404)
                .json({ message: "Order not Found" })
        }

        order.status = status;

        if (status == "shipped" && !order.shippedAt) {
            order.shippedAt = new Date()
        }

        if (status == "delivered" && !order.deliveredAt) {
            order.deliveredAt = new Date()
        }

        await order.save()

        return res
            .status(200)
            .json({ message: "Order Status Updated", order })

    } catch (error) {
        console.error("Error in Updating Order Status", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function getAllCustomers(req, res) {
    try {
        const customers = await User.find().sort({ createdAt: -1 })

        return res
            .status(200)
            .json({ message: "Fetched All Customers", customers })

    } catch (error) {
        console.error("Error in Getting All Customers", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function getDashboardStats(req, res) {
    try {
        const totalOrders = await Order.countDocuments()
        const revenueResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalPrice" }
                }
            }
        ])
        const totalRevenue = revenueResult[0]?.total || 0
        const totalCustomers = await User.countDocuments()
        const totalProducts = await Product.countDocuments()

        return res
            .status(200)
            .json({
                message: "Fetched Dashboard Stats",
                totalOrders,
                totalRevenue,
                totalCustomers,
                totalProducts
            })

    } catch (error) {
        console.error("Error in Getting Dashboard Stats", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}