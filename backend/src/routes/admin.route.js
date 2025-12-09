import { Router } from "express"
import { createProduct, deleteProduct, getAllCustomers, getAllOrders, getAllProducts, getDashboardStats, updateOrderStatus, updateProduct } from "../controllers/admin.controller.js";
import { adminOnly, protectRoute } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const adminRouter = Router()

adminRouter.use(protectRoute, adminOnly)

adminRouter.post("/products", upload.array("images", 3), createProduct);
adminRouter.get("/products", getAllProducts);
adminRouter.put("/products/:productId", upload.array("images", 3), updateProduct);
adminRouter.delete("/products/:productId", deleteProduct);

adminRouter.get("/orders", getAllOrders)
adminRouter.patch("/orders/:orderId/status", updateOrderStatus)

adminRouter.get("/customers", getAllCustomers)
adminRouter.get("/stats", getDashboardStats)

export default adminRouter;