import { Router} from 'express'
import { uploadFile } from '../controllers/upload'
import fileMiddleware from '../middlewares/file'
import { routes } from './config'
import { fileValidation } from '../middlewares/validations'
  
const uploadRouter = Router()
uploadRouter.post(routes.Upload.path, fileMiddleware.single('file'), fileValidation, uploadFile)

export default uploadRouter
