import { loginUserValidator, registerUserValidator } from "../validators/user.js"
import { UserModel } from "../models/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { mailtransporter } from "../utils/mail.js"

/**
 * Registers a new user in the system.
 *
 * Validates the request body using a Joi schema. If validation fails,
 * responds with a 422 Unprocessable Entity status. Checks if a user
 * with the given email already exists; if so, responds with a 409 Conflict
 * status. If the email is unique, hashes the password and creates a 
 * new user in the database. Sends a confirmation email to the user's 
 * email address upon successful registration. Responds with a success 
 * message if registration is completed. Catches errors and passes them 
 * to the error handling middleware.
 * 
 * @param {Object} req - The request object containing user registration details.
 * @param {Object} res - The response object used to send the response.
 * @param {Function} next - The next middleware function in the stack.
 */
export const registerUser = async (req, res, next) => {
    try {
        const { error, value } = registerUserValidator.validate(req.body)
        if (error) {
            return res.status(422).json(error)
        }
        const user = await UserModel.findOne({ email: value.email })
        if (user) {
            res.status(409).json('User already exists')
        }
        const hashedPassword = bcrypt.hashSync(value.password, 10);
        await UserModel.create({
            ...value,
            password: hashedPassword
        });

        await mailtransporter.sendMail({
            to: value.email,
            subject: 'USER REGISTRATION',
            text: 'Account registered successfully'
        })

        res.json('User registered successfully')
    } catch (error) {
        next(error)

    }

}

/**
 * Login a user. Verifies the email and password of the user using the
 * user model. If the email is not found or the password is incorrect, 
 * returns an error message with a 401 status. If the user is found and
 * the password is correct, generates a JWT token and sends it in the
 * response. Catches errors and passes them to the error handling middleware.
 * 
 * @param {Object} req - The request object containing user login details.
 * @param {Object} res - The response object used to send the response.
 * @param {Function} next - The next middleware function in the stack.
 */
export const loginUser = async (req, res, next) => {
    try {
        const { error, value } = loginUserValidator.validate(req.body)
        if (error) {
            return res.status(422).json(error)
        }
        const user = await UserModel.findOne({ email: value.email })
        if (!user) {
            return res.status(404).json('user does not exist')
        }
        const correctPassword = bcrypt.compareSync(value.password, user.password)
        if (!correctPassword) {
            return res.status(401).json('invalid credentials!')
        }
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: '24h' }
        )
        res.json({
            message: 'user logged in',
            accessToken: token
        })

    } catch (error) {
        next(error)
    }
}