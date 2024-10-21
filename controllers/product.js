import { ProductModel } from "../models/product.js";
import { productValidate } from "../validators/product.js";

export const addProduct = async (req, res, next) => {
    try {
        const { error, value } = productValidate.validate({
            ...req.body,
            image: req.file?.filename
        })
        if (error) {
            return res.status(422).json(error);
        }
        await ProductModel.create(value)
        res.status(201).json('Product was added')
    } catch (error) {
        next(error)
        
    }
}

export const getAllProducts = async (req, res, next) => {
try {
    const { filter = "{}", limit = 10, skip = 0}  = req.query;
    const products = await ProductModel
    .find(JSON.parse(filter))
    .limit(limit)
    .skip(skip);
    res.status(200).json(products)
} catch (error) {
    next(error)  
}
}

export const getProduct = (req, res, next) => {

}

export const updateProduct = (req, res, next) => {

}

export const deleteProduct = (req, res, next) => {

}