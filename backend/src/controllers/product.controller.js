import { Product } from "../models/product.model.js"


export async function getProductById(req, res) {
    try {
        const { productId } = req.params
        const product = await Product.findById(productId)

        if (!product) {
            return res
                .status(404)
                .json({ message: 'Product Not Found ' })
        }

        return res
            .status(200)
            .json({ message: 'Product Details Fetched', product })

    } catch (error) {
        console.error("Error in Getting Product", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}