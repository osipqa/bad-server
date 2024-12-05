
interface config {
    path: string
}

export const routes: Record<string, config> = {
    Products: {
        path: '/',
    },
    ProductById: {
        path: '/:productId',
    },
    Auth: {
        path: '/auth',
    },
    AuthUser: {
        path: '/user',
    },
    AuthMe: {
        path: '/me',
    },
    AuthRoles: {
        path: '/user/roles',
    },
    AuthLogin: {
        path: '/login',
    },
    AuthToken: {
        path: '/token',
    },
    AuthLogout: {
        path: '/logout',
    },
    AuthRegister: {
        path: '/register',
    },
    Orders: {
        path: '/',
    },
    OrdersAll: {
        path: '/all',
    },
    OrdersAllMe: {
        path: '/all/me',
    },
    OrderByNumber: {
        path: '/:orderNumber',
    },
    OrderMeByNumber: {
        path: '/me/:orderNumber',
    },
    OrderById: {
        path: '/:id',
    },
    Customers: {
        path: '/',
    },
    CustomerById: {
        path: '/:id',
    },
    Upload: {
        path: '/',
    },
} as const