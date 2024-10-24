import { ProductModel } from "../models/product.js";
import { productValidate, updateProductValidate } from "../validators/product.js";

/**
 * Adds a new product to the database.
 *
 * Validates the request body using a Joi schema. If validation fails,
 * responds with a 422 Unprocessable Entity status. If the request body
 * is valid, creates a new product in the database with the provided
 * information and the user who sent the request's ID. Responds with a
 * 201 Created status. Catches errors and passes them to the error
 * handling middleware.
 *
 * @param {Object} req - The request object containing product information.
 * @param {Object} res - The response object used to send the response.
 * @param {Function} next - The next middleware function in the stack.
 */
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


/**
 * Returns a list of products based on the query parameters.
 *
 * The response will be a JSON object with a single property, `products`, which
 * contains an array of products. The products are filtered by the query
 * parameter `filter`, sorted by the query parameter `sort`, limited to
 * `limit` items, and skipped by `skip` items.
 *
 * @param {Object} req - The request object containing query parameters.
 * @param {Object} res - The response object used to send the response.
 * @param {Function} next - The next middleware function in the stack.
 */
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

/**
 * Returns a product by id.
 * 
 * @param {Object} req - The request object containing product id in params.
 * @param {Object} res - The response object used to send the response.
 * @param {Function} next - The next middleware function in the stack.
 */
export const getProductById = async (req, res, next) => {
    try {
        const idProduct = await ProductModel.findById(req.params.id)
        res.status(201).json(idProduct)
    } catch (error) {
        next(error)
    }
}


/**
 * Returns the number of products in the database that match the given filter.
 *
 * The response will be a JSON object with a single property, `count`, which
 * contains the number of matching products.
 *
 * @param {Object} req - The request object containing a `filter` query parameter.
 * @param {Object} res - The response object used to send the response.
 * @param {Function} next - The next middleware function in the stack.
 */
export const countProducts = async (req, res, next) => {
    try {
        const { filter = "{}" } = req.query;
        // count products in database
        const count = await ProductModel.countDocuments(JSON.parse(filter));
        // respond to request
        res.json({ count });
    } catch (error) {
        next(error)
    }
}

/**
 * Updates a product by id.
 * 
 * @param {Object} req - The request object containing product id in params and new product data in body.
 * @param {Object} res - The response object used to send the response.
 * @param {Function} next - The next middleware function in the stack.
 */
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


/**
 * Deletes a product by id.
 * 
 * @param {Object} req - The request object containing product id in params.
 * @param {Object} res - The response object used to send the response.
 * @param {Function} next - The next middleware function in the stack.
 */
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