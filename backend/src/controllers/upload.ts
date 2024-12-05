import { NextFunction, Request, Response } from 'express'
import BadRequestError from '../errors/bad-request-error'
import { v4 as uuidv4 } from 'uuid'
import path from 'path';

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'));
    }

    try {
        const fileExtension = path.extname(req.file.originalname);
        const uniqueFileName = `${uuidv4()}${fileExtension}`;

        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${uniqueFileName}`
            : `/${uniqueFileName}`;

        return res.status(201).send({
            fileName,
            originalName: req.file.originalname,
        });
    } catch (error) {
        return next(error);
    }
};

export default {}
