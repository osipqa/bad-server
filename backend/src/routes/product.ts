import { Router } from 'express'
import {
    createProduct,
    deleteProduct,
    getProducts,
    updateProduct,
} from '../controllers/products'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import {
    validateObjId,
    validateProductBody,
    validateProductUpdateBody,
} from '../middlewares/validations'
import { Role } from '../models/user'
import { routes } from './config'

const productRouter = Router()

productRouter.get(routes.Products.path, getProducts)
productRouter.post(
    routes.Products.path,
    auth,
    roleGuardMiddleware(Role.Admin),
    validateProductBody,
    createProduct
)
productRouter.delete(
    routes.ProductById.path,
    auth,
    roleGuardMiddleware(Role.Admin),
    validateObjId,
    deleteProduct
)
productRouter.patch(
    routes.ProductById.path,
    auth,
    roleGuardMiddleware(Role.Admin),
    validateObjId,
    validateProductUpdateBody,
    updateProduct
)

export default productRouter
