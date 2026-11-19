import { Router } from "express";
import { getAllProducts,getProductsById,getMyProductById,createProduct,deleteProduct } from "../controllers/productController";







const productRoute = Router();

productRoute.post('/',createProduct);
productRoute.get('/',getAllProducts);
productRoute.get('/:id',getProductsById)
productRoute.get('/my-products', getMyProductById);
productRoute.delete('/:id',deleteProduct);






export default productRoute
