import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';

export function validateImage(
    req: Request,
    res: Response,
    next: NextFunction
): void {

    if (!req.file) {
        res.status(400).json();
        return
    }

    const filePath = req.file.path;
    sharp(filePath)
        .metadata()
        .then((metadata) => {
            console.log('metadata', metadata);
            
            const width = metadata.width ?? 0;
            const height = metadata.height ?? 0;
            const minWidth = 25;
            const minHeight = 25;

            if (width < minWidth || height < minHeight) {
                return res.status(400).json({
                    error: `Too small size. Min size: ${minWidth}x${minHeight}`,
                });
            }

            next();
        })
        .catch(() => {
            res.status(500).json({ error: 'Error validate' });
        });
}
