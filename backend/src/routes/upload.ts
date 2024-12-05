import { Router} from 'express'
import { uploadFile } from '../controllers/upload'
import fileMiddleware from '../middlewares/file'
import { routes } from './config'
  
const uploadRouter = Router()
uploadRouter.post(routes.Upload.path, fileMiddleware.single('file'), uploadFile)

export default uploadRouter
