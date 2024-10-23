import { Router } from "express";
import { addCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory, countCategories } from "../controllers/category.js";
import { productImage } from "../middlewares/upload.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { hasPermission } from "../middlewares/auth.js";

const categoryRouter = Router();

categoryRouter.post('/categories', isAuthenticated, hasPermission('post_products'), productImage.single('image'), addCategory)
categoryRouter.get('/categories', getAllCategories)
categoryRouter.get('/categories/count', countCategories);
categoryRouter.get('/categories/:id', getCategoryById)
categoryRouter.patch('/categories/:id', isAuthenticated, hasPermission('update_products'), productImage.single('image'), updateCategory);
categoryRouter.delete('/categories/:id', isAuthenticated, hasPermission('delete_products'), deleteCategory);




export default categoryRouter;