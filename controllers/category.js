import { CategoryModel } from "../models/category.js";
import { categorytValidate, updateCategoryValidate } from "../validators/category.js";
export const addCategory = async (req, res, next) => {
    try {
        const { error, value } = categorytValidate.validate({
            ...req.body,
            image: req.file?.filename
        })
        if (error) {
            return res.status(422).json(error);
        }
       const productAdded = await CategoryModel.create({
            ...value,
            user: req.auth.id
        })
        res.status(201).json(productAdded)
    } catch (error) {
        next(error);
    }
}

export const getAllCategories = async (req, res, next) => {
    try {
        const { filter = "{}", sort = "{}", limit = 100, skip = 0 } = req.query;
        const categories = await CategoryModel
            .find(JSON.parse(filter))
            .sort(JSON.parse(sort))
            .limit(limit)
            .skip(skip);
        res.status(200).json(categories)
    } catch (error) {
        next(error)
    }
}

export const getCategoryById = async (req, res, next) => {
    try {
        const idCategory = await CategoryModel.findById(req.params.id)
        res.status(201).json(idCategory)
    } catch (error) {
        next(error)
    }
}

export const countCategories = async (req, res, next) => {
    try {
        const { filter = "{}" } = req.query;
        // count categories in database
        const count = await CategoryModel.countDocuments(JSON.parse(filter));
        // respond to request
        res.json({ count });
    } catch (error) {
        next(error)
    }
}

export const updateCategory = async (req, res, next) => {
    try {
        const { error, value } = updateCategoryValidate.validate({
            ...req.body,
            image: req.file?.filename
        });
        if (error) {
            return res.status(422).json(error);
        }
        const category = await CategoryModel.findOneAndUpdate(
            { _id: req.params.id, user: req.auth.id }, value, { new: true }
        );
        if (!category) {
            return res.status(404).json('Category not found!')
        }
        res.json(value)
    } catch (error) {
        next(error)
    }
}

export const deleteCategory = async (req, res, next) => {
    try {
        const del = await CategoryModel.findOneAndDelete({ _id: req.params.id, user: req.auth.id });
        if (!del) {
            return res.status(404).json('Category not found!')
        }
        res.status(200).json('Category deleted successfully!')
    } catch (error) {
        next(error)
    }
}