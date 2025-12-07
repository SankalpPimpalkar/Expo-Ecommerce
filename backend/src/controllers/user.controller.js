import { User } from "../models/user.model"

export async function addAddress(req, res) {
    try {
        const { label, fullName, streetAddress, city, state, zipCode, phoneNumber, isDefault } = req.body
        const user = req.user

        if (isDefault) {
            user.addresses.forEach(address => {
                address.isDefault = false
            })
        }

        user.addresses.push({
            label,
            fullName,
            streetAddress,
            city,
            state, zipCode,
            phoneNumber,
            isDefault: isDefault || false
        })

        await user.save()

        return res
            .status(201)
            .json({ message: "New address added", addresses: user.addresses })

    } catch (error) {
        console.error("Error in Adding Address", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function getAddresses(req, res) {
    try {
        const user = req.user

        return res
            .status(200)
            .json({ message: "Fetched addresses", addresses: user.addresses })

    } catch (error) {
        console.error("Error in Getting Addresses", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function updateAddress(req, res) {
    try {
        const { label, fullName, streetAddress, city, state, zipCode, phoneNumber, isDefault } = req.body
        const user = req.user
        const { addressId } = req.params

        const address = req.user.addresses.id(addressId)

        if (!address) {
            return res
                .status(400)
                .json({ message: "Address not Found" })
        }

        if (isDefault) {
            user.addresses.forEach(address => {
                address.isDefault = false
            })
        }

        address.label = label || address.label
        address.fullName = fullName || address.fullName
        address.streetAddress = streetAddress || address.streetAddress
        address.city = city || address.city
        address.state = state || address.state
        address.zipCode = zipCode || address.zipCode
        address.phoneNumber = phoneNumber || address.phoneNumber
        address.isDefault = isDefault !== undefined ? isDefault : address.isDefault

        await user.save()

        return res
            .status(200)
            .json({ message: "Address Updated", addresses: user.addresses })

    } catch (error) {
        console.error("Error in Updating Address", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function deleteAddress(req, res) {
    try {
        const { addressId } = req.params
        const user = req.user

        user.addresses.pull(addressId)
        await user.save()

        return res
            .status(200)
            .json({ message: "Address Deleted", addresses: user.addresses })

    } catch (error) {
        console.error("Error in Deleting Address", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function addToWishList(req, res) {
    try {
        const { productId } = req.body
        const user = req.user

        if (user.wishlist.includes(productId)) {
            return res
                .status(400)
                .json({ message: "Product already added to wishlist" })
        }

        user.wishlist.push(productId)
        await user.save()

        return res
            .status(200)
            .json({ message: "Product Added to WishList" })

    } catch (error) {
        console.error("Error in Adding Product in WishList", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function getWishList(req, res) {
    try {
        const user = await User.findById(req.user._id).populate("wishlist")
        const wishlist = user.wishlist

        return res
            .status(200)
            .json({ message: "WishList Fetched", wishlist: user.wishlist })

    } catch (error) {
        console.error("Error in Getting WishList", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}

export async function removeFromWishList(req, res) {
    try {
        const user = req.user
        const { productId } = req.params

        user.wishlist.pull(productId)
        await user.save()

        return res
            .status(200)
            .json({ message: "Product Removed from WishList" })

    } catch (error) {
        console.error("Error in Removing Product from WishList", error)
        return res
            .status(500)
            .json({ message: "Internal Server Error" })
    }
}