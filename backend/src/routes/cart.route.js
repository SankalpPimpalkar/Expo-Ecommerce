import { Router } from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { addToCart, clearCart, deleteCartItem, getCart, updateCartItem } from "../controllers/cart.controller.js";

const cartRouter = Router()

cartRouter.post("/", protectRoute, addToCart)
cartRouter.get("/", protectRoute, getCart)
cartRouter.put("/:productId", protectRoute, updateCartItem)
cartRouter.delete("/:productId", protectRoute, deleteCartItem)
cartRouter.delete("/", protectRoute, clearCart)

export default cartRouter;