import { expressjwt } from "express-jwt";
import { UserModel } from "../models/user.js";
import { permissions } from "../utils/rbac.js";

export const isAuthenticated = expressjwt({
    secret: process.env.JWT_PRIVATE_KEY,
    algorithms: ['HS256']
})


/**
 * Middleware to check if a user has the required permission for a specific action.
 *
 * This middleware function retrieves the user's role from the database and checks
 * if the role has the necessary permissions to perform the specified action.
 * If the role includes the action in its list of permissions, the middleware
 * calls the next function to continue processing the request. If the role does
 * not include the action, it responds with a 403 Forbidden status. If no permission
 * is found for the role, it also responds with a 403 Forbidden status.
 *
 * @param {string} action - The action for which permission is required.
 * @returns {Function} An Express middleware function that checks permissions.
 */
export const hasPermission = (action) => {
    return async (req,res, next) => {
try {
    // find user from database
    const user = await UserModel.findById(req.auth.id) 
    // use the user role to find their permission
    const permission = permissions.find(value => value.role === user.role);
    if (!permission){
        return res.status(403).json('No permission found')
    }
    // check if permission actions include action
    if (permission.actions.includes(action)){
        next();
    } else{
        res.status(403).json('Action not allowed')
    }
} catch (error) {
    next(error)
    
}
    }
}