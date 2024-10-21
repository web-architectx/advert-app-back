import { Router } from "express";
import { addProduct, getAllProducts } from "../controllers/product.js";
import { productImage } from "../middlewares/upload.js";


const productRouter = Router();

productRouter.post('/products', productImage.single('image'), addProduct)
productRouter.get('/products', getAllProducts)

export default productRouter;