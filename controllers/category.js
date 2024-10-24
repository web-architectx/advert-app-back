import { CategoryModel } from "../models/category.js";
import { categorytValidate, updateCategoryValidate } from "../validators/category.js";
/**
 * Adds a category to the database. Expects a JSON body with the following fields: 
 * name: The name of the category.
 * image: The image of the category. If a file is sent, the filename will be used.
 * 
 * @param {Object} req - The request object containing the category data.
 * @param {Object} res - The response object used to send the response.
 * @param {Function} next - The next middleware function in the stack.
 * 
 * @returns {Promise<void>}
 */
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

/**
 * Retrieves a list of categories from the database based on query parameters.
 *
 * The response will be a JSON array of categories, filtered by the query
 * parameter `filter`, sorted by the query parameter `sort`, limited to
 * `limit` items, and skipped by `skip` items.
 *
 * @param {Object} req - The request object containing query parameters.
 * @param {Object} res - The response object used to send the response.
 * @param {Function} next - The next middleware function in the stack.
 */
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

/**
 * Retrieves a single category by id from the database.
 *
 * Responds with a 201 Created status and the category as a JSON object.
 *
 * @param {Object} req - The request object containing the category id in params.
 * @param {Object} res - The response object used to send the response.
 * @param {Function} next - The next middleware function in the stack.
 */
export const getCategoryById = async (req, res, next) => {
    try {
        const idCategory = await CategoryModel.findById(req.params.id)
        res.status(201).json(idCategory)
    } catch (error) {
        next(error)
    }
}

/**
 * Returns the number of categories in the database that match the given filter.
 *
 * The response will be a JSON object with a single property, `count`, which
 * contains the number of matching categories.
 *
 * @param {Object} req - The request object containing a `filter` query parameter.
 * @param {Object} res - The response object used to send the response.
 * @param {Function} next - The next middleware function in the stack.
 */
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

/**
 * Updates a category by id.
 *
 * Validates the request body using a Joi schema. If validation fails,
 * responds with a 422 Unprocessable Entity status. Checks if a category
 * with the given id exists and if the user who sent the request has the
 * necessary permissions to update the category. Updates the category
 * in the database with the provided information and responds with a
 * 200 OK status. Catches errors and passes them to the error
 * handling middleware.
 *
 * @param {Object} req - The request object containing the category id in params and new category data in body.
 * @param {Object} res - The response object used to send the response.
 * @param {Function} next - The next middleware function in the stack.
 */
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

/**
 * Deletes a category by id.
 *
 * Checks if a category with the given id exists and if the user who sent the
 * request has the necessary permissions to delete the category. Deletes the
 * category from the database and responds with a 200 OK status. Catches
 * errors and passes them to the error handling middleware.
 *
 * @param {Object} req - The request object containing the category id in params.
 * @param {Object} res - The response object used to send the response.
 * @param {Function} next - The next middleware function in the stack.
 */
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