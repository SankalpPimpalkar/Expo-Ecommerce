import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/
    const extName = allowedTypes.test(path.extname(file.originalname).toLocaleLowerCase())
    const mimeType = allowedTypes.test(file.mimeType)

    if (extName && mimeType) {
        cb(null, true)
    } else {
        cb(new Error("Only Image Files are allowed "))
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: { fieldSize: 5 * 1024 * 1024 }, // 5MB
})