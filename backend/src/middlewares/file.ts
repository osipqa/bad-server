import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { join } from 'path'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

// Ограничения на размер файла
export const fileSizeLimits = {
    // Минимальный размер файла 2KB
    minFileSize: 2048,  // 2 KB
    // Максимальный размер файла 10MB
    maxFileSize: 10485760,  // 10 MB
}

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        cb(
            null,
            join(
                __dirname,
                process.env.UPLOAD_PATH_TEMP
                    ? `../public/${process.env.UPLOAD_PATH_TEMP}`
                    : '../public'
            )
        )
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        cb(null, file.originalname)
    },
})

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!types.includes(file.mimetype)) {
        return cb(null, false)
    }

    if (file.size < fileSizeLimits.minFileSize) {
        return cb(null, false)
    }

    cb(null, true)
}

export default multer({ storage, fileFilter, limits: {
    fileSize: fileSizeLimits.maxFileSize
}})
