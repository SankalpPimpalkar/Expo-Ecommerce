import { Router } from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createReview, deleteReview } from "../controllers/review.controller.js";

const reviewRouter = Router()

reviewRouter.post("/", protectRoute, createReview)
reviewRouter.delete("/:reviewId", protectRoute, deleteReview)

export default reviewRouter;