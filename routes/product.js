import { Router } from "express";
import { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct, countProducts } from "../controllers/product.js";
import { productImage } from "../middlewares/upload.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { hasPermission } from "../middlewares/auth.js";

const productRouter = Router();

productRouter.post('/products', isAuthenticated, hasPermission('post_products'), productImage.single('image'), addProduct)
productRouter.get('/products', getAllProducts)
productRouter.get('/products/count', isAuthenticated, hasPermission('count_products'), countProducts);
productRouter.get('/products/:id',isAuthenticated, hasPermission('get_products_id'), getProductById)
productRouter.patch('/products/:id', isAuthenticated, hasPermission('update_products'), productImage.single('image'), updateProduct);
productRouter.delete('/products/:id', isAuthenticated, hasPermission('delete_products'), deleteProduct);




export default productRouter;