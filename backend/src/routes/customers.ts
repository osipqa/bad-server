import { Router } from 'express'
import {
    deleteCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
} from '../controllers/customers'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import { Role } from '../models/user'
import { routes } from './config'

const customerRouter = Router()

customerRouter.get(
    routes.Customers.path,
    auth,
    roleGuardMiddleware(Role.Admin),
    getCustomers
)
customerRouter.get(
    routes.CustomerById.path,
    auth,
    roleGuardMiddleware(Role.Admin),
    getCustomerById
)
customerRouter.patch(
    routes.CustomerById.path,
    auth,
    roleGuardMiddleware(Role.Admin),
    updateCustomer
)
customerRouter.delete(
    routes.CustomerById.path,
    auth,
    roleGuardMiddleware(Role.Admin),
    deleteCustomer
)

export default customerRouter