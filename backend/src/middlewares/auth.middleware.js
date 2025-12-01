import { requireAuth } from "@clerk/express"
import { User } from "../models/user.model.js"
import { ENV } from "../config/config.js"

export const protectRoute = [
    requireAuth(),
    async (req, res, next) => {
        try {
            const clerkId = req.auth().userId
            if (!clerkId) {
                return res
                    .status(401)
                    .json({ message: "Unauthorized request - Invalid Token" })
            }

            const user = await User.findOne({ clerkId })

            if (!user) {
                return res
                    .status(404)
                    .json({ message: "User not Found" })
            }

            req.user = user
            next()

        } catch (error) {
            console.error("Error in protectRoute Middleware", error)
            return res
                .status(500)
                .json({ message: "Internal Server Error " })
        }
    }
]

export const adminOnly = (req, res, next) => {
    if (req.user.email !== ENV.ADMIN_EMAIL) {
        return res
            .status(403)
            .json({ message: "Forbidden Request - Admin Access Only" })
    }

    next()
}