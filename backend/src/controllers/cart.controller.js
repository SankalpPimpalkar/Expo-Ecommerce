import { Cart } from "../models/cart.model.js"
import { Product } from "../models/product.model.js"

export async function getCart(req, res) {
    try {
        const user = req.user
        let cart = await Cart.find({ clerkId: user.clerkId }).populate("items.product")

        if (!cart) {
            cart = await Cart.create({
                user: user._id,
                clerkId: user.clerkId,
                items: []
            })
        }

        return res
            .status(200)
            .json({ message: "Cart Fetched", cart })

    } catch (error) {
        console.error("Error in Adding Item to Cart", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function addToCart(req, res) {
    try {
        const { productId, quantity = 1 } = req.body
        const user = req.user

        const product = await Product.findById(productId)

        if (!productId) {
            return res
                .status(404)
                .json({ message: "Product not Found" })
        }

        if (product.stock < quantity) {
            return res
                .status(400)
                .json({ message: "Product is out of stock" })
        }

        const cart = await Cart.findOne({ clerkId: user.clerkId })

        if (!cart) {
            await Cart.create({
                user: user._id,
                clerkId: user.clerkId,
                items: []
            })
        }

        const existingItem = cart.items.find(item => item.product.toString() === productId)

        if (existingItem) {
            const newQuantity = existingItem.quantity + 1
            if (product.stock < newQuantity) {
                return res
                    .status(400)
                    .json({ message: "Product is out of stock" })
            }
            existingItem.quantity = newQuantity
        } else {
            cart.items.push({ product: product._id, quantity })
        }

        await cart.save()

        return res
            .status(200)
            .json({ message: "Item Added To Cart", cart })

    } catch (error) {
        console.error("Error in Getting Cart", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function updateCartItem(req, res) {
    try {
        const { productId } = req.params
        const { quantity } = req.body
        const user = req.user

        if (quantity < 1) {
            return res
                .status(400)
                .json({ message: "Quantity must be atleast 1" })
        }

        const cart = await Cart.findOne({ clerkId: user.clerkId }).populate("items.product")
        if (!cart) {
            return res
                .status(404)
                .json({ message: "Cart not found" })
        }

        const existingItemIndex = cart.items.findIndex(item => item.product._id.toString() === productId)
        if (existingItemIndex === -1) {
            return res
                .status(404)
                .json({ message: "Item not found in Cart" })
        }

        const product = await Product.findById(productId)
        if (!product) {
            return res
                .status(404)
                .json({ message: "Product not found" })
        }

        if (product.stock < quantity) {
            return res
                .status(400)
                .json({ message: "Product is out of stock" })
        }

        cart.items[existingItemIndex].quantity = quantity
        await cart.save()

        return res
            .status(200)
            .json({ message: "Cart Updated", cart })

    } catch (error) {
        console.error("Error in Updating Item in Cart", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function deleteCartItem(req, res) {
    try {
        const { productId } = req.params
        const user = req.user

        const cart = await Cart.findOne({ clerkId: user.clerkId }).populate("items.product")
        if (!cart) {
            return res
                .status(404)
                .json({ message: "Cart not found" })
        }

        const product = await Product.findById(productId)
        if (!product) {
            return res
                .status(404)
                .json({ message: "Product not found" })
        }

        cart.items = cart.items.filter(item => item.product._id.toString() === productId)
        await cart.save()

        return res
            .status(200)
            .json({ message: "Item removed from Cart", cart })

    } catch (error) {
        console.error("Error in Removing Item from Cart", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function clearCart(req, res) {
    try {
        const user = req.user

        const cart = await Cart.findOne({ clerkId: user.clerkId })
        if (!cart) {
            return res
                .status(404)
                .json({ message: "Cart not found" })
        }

        cart.items = []
        await cart.save()

        return res
            .status(200)
            .json({ message: "Cart Cleared", cart })

    } catch (error) {
        console.error("Error in Clearing Cart", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}