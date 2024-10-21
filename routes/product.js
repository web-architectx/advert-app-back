import { Router } from "express";
import { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../controllers/product.js";
import { productImage } from "../middlewares/upload.js";


const productRouter = Router();

productRouter.post('/products', productImage.single('image'), addProduct)
productRouter.get('/products', getAllProducts)
productRouter.get('/products/:id', getProductById)
productRouter.patch('/products/:id', productImage.single('image'), updateProduct);
productRouter.delete('/products/:id', deleteProduct);




export default productRouter;