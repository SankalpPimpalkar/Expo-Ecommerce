import { Router } from "express"
import { adminOnly, protectRoute } from "../middlewares/auth.middleware.js";
import { createOrder, getUserOrders } from "../controllers/order.controller.js";

const orderRouter = Router()

orderRouter.post("/", protectRoute, createOrder)
orderRouter.get("/", protectRoute, getUserOrders)

export default orderRouter;