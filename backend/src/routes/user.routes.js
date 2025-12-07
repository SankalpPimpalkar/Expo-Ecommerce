import { Router } from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { addAddress, getAddresses, deleteAddress, updateAddress, addToWishList, getWishList, removeFromWishList } from "../controllers/user.controller.js";

const userRouter = Router()

// Addresses
userRouter.post("/addresses", protectRoute, addAddress)
userRouter.get("/addresses", protectRoute, getAddresses)
userRouter.put("/addresses/:addressId", protectRoute, updateAddress)
userRouter.delete("/addresses/:addressId", protectRoute, deleteAddress)

// Wishlists
userRouter.post("/wishlist", protectRoute, addToWishList)
userRouter.get("/wishlist", protectRoute, getWishList)
userRouter.delete("/wishlist/:productId", protectRoute, removeFromWishList)

export default userRouter;