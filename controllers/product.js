import { ProductModel } from "../models/product.js";
import { productValidate, updateProductValidate } from "../validators/product.js";

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
        next(error);
    }
}

export const getAllProducts = async (req, res, next) => {
    try {
        const { filter = "{}", limit = 100, skip = 0 } = req.query;
        const products = await ProductModel
            .find(JSON.parse(filter))
            .limit(limit)
            .skip(skip);
        res.status(200).json(products)
    } catch (error) {
        next(error)
    }
}

export const getProductById = async (req, res, next) => {
    try {
        const idProduct = await ProductModel.findById(req.params.id)
        res.status(201).json(idProduct)
    } catch (error) {
        next(error)
    }
}

export const updateProduct = async (req, res, next) => {
    try {
       const { error, value } = updateProductValidate.validate({
        ...req.body,
        image: req.file?.filename
       });
       if (error) {
        return res.status(422).json(error);
       }
       await ProductModel.findByIdAndUpdate(req.params.id, value, {new:true});
       res.json(value)
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req, res, next) => {
   const del = await ProductModel.findByIdAndDelete(req.params.id)
   res.status(200).json('Product deleted successfully!')
   
}