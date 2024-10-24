import { loginUserValidator, registerUserValidator } from "../validators/user.js"
import { UserModel } from "../models/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { mailtransporter } from "../utils/mail.js"
import { ProductModel } from "../models/product.js"

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

export const getProfile = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.auth.id)
        .select({password: false});
        res.json(user)
    } catch (error) {
        next (error)    
    }
}

export const getUserProducts = async (req, res, next) => {
    try {
        const { filter = "{}", sort = "{}", limit = 100, skip = 0 } = req.query;
        const products = await ProductModel
            .find({
                ...JSON.parse(filter),
                user: req.auth.id
            })
            .sort(JSON.parse(sort))
            .limit(limit)
            .skip(skip);
        res.status(200).json(products)
        
    } catch (error) {
        next (error);
        
    }
}