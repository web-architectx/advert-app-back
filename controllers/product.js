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
        await ProductModel.create({
            ...value,
            user: req.auth.id
        })
        res.status(201).json('Product was added')
    } catch (error) {
        next(error);
    }
}

export const getAllProducts = async (req, res, next) => {
    try {
        const { filter = "{}", sort = "{}", limit = 100, skip = 0 } = req.query;
        const products = await ProductModel
            .find(JSON.parse(filter))
            .sort(JSON.parse(sort))
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

export const countProducts = async (req, res, next) => {
    try {
        const { filter = "{}" } = req.query;
        const count = await ProductModel.countDocuments(JSON.parse(filter));
        res.json({ count });
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
        const product = await ProductModel.findOneAndUpdate(
            { _id: req.params.id, user: req.auth.id }, value, { new: true }
        );
        if (!product) {
            return res.status(404).json('AD not found')
        }
        res.json(value)
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        const del = await ProductModel.findOneAndDelete({ _id: req.params.id, user: req.auth.id });
        if (!del) {
            return res.status(404).json('Ad not found.')
        }
        res.status(200).json('Product deleted successfully!')
    } catch (error) {
        next(error)
    }
}