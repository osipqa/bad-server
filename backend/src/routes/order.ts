import { Router } from 'express'
import {
    createOrder,
    deleteOrder,
    getOrderByNumber,
    getOrderCurrentUserByNumber,
    getOrders,
    getOrdersCurrentUser,
    updateOrder,
} from '../controllers/order'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import { validateOrderBody } from '../middlewares/validations'
import { Role } from '../models/user'
import { routes } from './config'

const orderRouter = Router()

orderRouter.post(routes.Orders.path, auth, validateOrderBody, createOrder)
orderRouter.get(routes.OrdersAll.path, auth, roleGuardMiddleware(Role.Admin), getOrders)
orderRouter.get(routes.OrdersAllMe.path, auth, getOrdersCurrentUser)
orderRouter.get(
    routes.OrderByNumber.path,
    auth,
    roleGuardMiddleware(Role.Admin),
    getOrderByNumber
)
orderRouter.get(routes.OrderMeByNumber.path, auth, getOrderCurrentUserByNumber)
orderRouter.patch(
    routes.OrderByNumber.path,
    auth,
    roleGuardMiddleware(Role.Admin),
    updateOrder
)

orderRouter.delete(routes.OrderById.path, auth, roleGuardMiddleware(Role.Admin), deleteOrder)

export default orderRouter
