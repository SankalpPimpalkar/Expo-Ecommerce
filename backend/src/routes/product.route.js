import { Router } from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getProductById } from "../controllers/product.controller.js";
import { getAllProducts } from "../controllers/admin.controller.js";

const productRouter = Router()

productRouter.get("/", protectRoute, getAllProducts)
productRouter.get("/:productId", protectRoute, getProductById )

export default productRouter;