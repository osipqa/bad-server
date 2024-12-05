import { NextFunction, Request, Response } from 'express'
import { FilterQuery } from 'mongoose'
import NotFoundError from '../errors/not-found-error'
import Order from '../models/order'
import User, { IUser } from '../models/user'
import escapeRegExp from '../utils/escapeRegExp'

// TODO: Добавить guard admin
// eslint-disable-next-line max-len
// Get GET /customers?page=2&limit=5&sort=totalAmount&order=desc&registrationDateFrom=2023-01-01&registrationDateTo=2023-12-31&lastOrderDateFrom=2023-01-01&lastOrderDateTo=2023-12-31&totalAmountFrom=100&totalAmountTo=1000&orderCountFrom=1&orderCountTo=10
export const getCustomers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortField = 'createdAt',
            sortOrder = 'desc',
            registrationDateFrom,
            registrationDateTo,
            lastOrderDateFrom,
            lastOrderDateTo,
            totalAmountFrom,
            totalAmountTo,
            orderCountFrom,
            orderCountTo,
            search,
        } = req.query

        const normalizedLimit = Math.min(Math.max(Number(limit), 1), 10)

        const filters: FilterQuery<Partial<IUser>> = {}

        const parseDate = (dateString: string) => {
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? null : date;
        };

        if (registrationDateFrom) {
            const fromDate = parseDate(registrationDateFrom as string);
            if (fromDate) filters.createdAt = { ...filters.createdAt, $gte: fromDate };
        }

        if (registrationDateTo) {
            const toDate = parseDate(registrationDateTo as string);
            if (toDate) {
                toDate.setHours(23, 59, 59, 999);
                filters.createdAt = { ...filters.createdAt, $lte: toDate };
            }
        }

        if (lastOrderDateFrom) {
            const fromDate = parseDate(lastOrderDateFrom as string);
            if (fromDate) filters.lastOrderDate = { ...filters.lastOrderDate, $gte: fromDate };
        }

        if (lastOrderDateTo) {
            const toDate = parseDate(lastOrderDateTo as string);
            if (toDate) {
                toDate.setHours(23, 59, 59, 999);
                filters.lastOrderDate = { ...filters.lastOrderDate, $lte: toDate };
            }
        }

        const parseNumber = (value: string) => {
            const parsed = Number(value);
            return isNaN(parsed) ? null : parsed;
        };

        if (totalAmountFrom) {
            const amount = parseNumber(totalAmountFrom as string);
            if (amount) filters.totalAmount = { ...filters.totalAmount, $gte: amount };
        }

        if (totalAmountTo) {
            const amount = parseNumber(totalAmountTo as string);
            if (amount) filters.totalAmount = { ...filters.totalAmount, $lte: amount };
        }

        if (orderCountFrom) {
            const count = parseNumber(orderCountFrom as string);
            if (count) filters.orderCount = { ...filters.orderCount, $gte: count };
        }

        if (orderCountTo) {
            const count = parseNumber(orderCountTo as string);
            if (count) filters.orderCount = { ...filters.orderCount, $lte: count };
        }
        
        if (search) {
            const searchRegex = new RegExp(escapeRegExp(search as string), 'i')
            const orders = await Order.find(
                {
                    $or: [{ deliveryAddress: searchRegex }],
                },
                '_id'
            )

            const orderIds = orders.map((order) => order._id)

            filters.$or = [
                { name: searchRegex },
                { lastOrder: { $in: orderIds } },
            ]
        }

        const sort: { [key: string]: any } = {}

        if (sortField && sortOrder) {
            sort[sortField as string] = sortOrder === 'desc' ? -1 : 1
        }

        const options = {
            sort,
            skip: (Number(page) - 1) * normalizedLimit,
            limit: normalizedLimit,
        }

        const users = await User.find(filters, null, options).populate([
            'orders',
            {
                path: 'lastOrder',
                populate: {
                    path: 'products',
                },
            },
            {
                path: 'lastOrder',
                populate: {
                    path: 'customer',
                },
            },
        ])

        const totalUsers = await User.countDocuments(filters)
        const totalPages = Math.ceil(totalUsers / normalizedLimit )

        res.status(200).json({
            customers: users,
            pagination: {
                totalUsers,
                totalPages,
                currentPage: Number(page),
                pageSize: normalizedLimit,
            },
        })
    } catch (error) {
        next(error)
    }
}

// TODO: Добавить guard admin
// Get /customers/:id
export const getCustomerById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findById(req.params.id).populate([
            'orders',
            'lastOrder',
        ])
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

// TODO: Добавить guard admin
// Patch /customers/:id
export const updateCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        )
            .orFail(
                () =>
                    new NotFoundError(
                        'Пользователь по заданному id отсутствует в базе'
                    )
            )
            .populate(['orders', 'lastOrder'])
        res.status(200).json(updatedUser)
    } catch (error) {
        next(error)
    }
}

// TODO: Добавить guard admin
// Delete /customers/:id
export const deleteCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id).orFail(
            () =>
                new NotFoundError(
                    'Пользователь по заданному id отсутствует в базе'
                )
        )
        res.status(200).json(deletedUser)
    } catch (error) {
        next(error)
    }
}
