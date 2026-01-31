import express from "express";
import { isAdmine, isAuthenticated } from "../middleware/isAuthenticated.js";
import { MultipleUpload } from "../middleware/multer.js";
import { addProduct, deleteProduct, getAllProduct, updateProduct } from "../controllers/productController.js";

const route=express.Router()

route.post(`/add`,isAuthenticated,isAdmine,MultipleUpload,addProduct)
route.get(`/getallproducts`,getAllProduct)
route.delete(`/delete/:productId`,isAuthenticated,isAdmine,deleteProduct)
route.put(`/update/:productId`,isAuthenticated,isAdmine,MultipleUpload,updateProduct)
export default route