import { Router } from 'express'
import {
    getCurrentUser,
    getCurrentUserRoles,
    login,
    logout,
    refreshAccessToken,
    register,
    updateCurrentUser,
} from '../controllers/auth'
import auth from '../middlewares/auth'
import { validateAuthentication, validateUserBody } from '../middlewares/validations'
import { routes } from './config'

const authRouter = Router()

authRouter.get(routes.AuthUser.path, auth, getCurrentUser)
authRouter.patch(routes.AuthMe.path, auth, updateCurrentUser)
authRouter.get(routes.AuthRoles.path, auth, getCurrentUserRoles)
authRouter.post(routes.AuthLogin.path, validateAuthentication, login)
authRouter.get(routes.AuthToken.path, refreshAccessToken)
authRouter.get(routes.AuthLogout.path, logout)
authRouter.post(routes.AuthRegister.path, validateUserBody, register)

export default authRouter
