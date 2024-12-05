import { Router} from 'express'
import { uploadFile } from '../controllers/upload'
import fileMiddleware from '../middlewares/file'
import { routes } from './config'
import { validateImage } from '../middlewares/validateImage'
  
const uploadRouter = Router()
uploadRouter.post(routes.Upload.path, fileMiddleware.single('file'), validateImage, uploadFile)

export default uploadRouter
