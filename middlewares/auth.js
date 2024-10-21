import { expressjwt } from "express-jwt";
import { UserModel } from "../models/user.js";
import { permissions } from "../utils/rbac.js";

export const isAuthenticated = expressjwt({
    secret: process.env.JWT_PRIVATE_KEY,
    algorithms: ['HS256']
})


export const hasPermission = (action) => {
    try {
        return async (req, res, next) => {
            const user = await UserModel.findById(req.auth.id)
            const permission = permissions.find(value => value.role === user.role)
            if (!permission) {
                return res.status(403).json('No permission found')
            }
            if (permission.actions.includes(action)) {
                next();   
            }else{
                res.status(403).json('Action not allowed')
            }
        }
    } catch (error) {
        next(error)
    }
}