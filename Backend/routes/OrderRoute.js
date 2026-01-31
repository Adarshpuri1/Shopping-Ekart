import express, { Router } from 'express'
import { createOrder, getAllOrdersAdmin, getMyOrder, getSalesData, getUserOrders, verifyPayment } from '../controllers/orderController.js';
import { isAdmine, isAuthenticated } from '../middleware/isAuthenticated.js';

const router=express.Router();
router.post('/create-order',isAuthenticated,createOrder)
router.post('/verify',isAuthenticated,verifyPayment)
router.get('/my-order',isAuthenticated,getMyOrder)
router.get('/user-order/:userId',isAuthenticated,getUserOrders)
router.get('/all',isAuthenticated,isAdmine,getAllOrdersAdmin)
router.get("/sales",isAuthenticated,isAdmine,getSalesData)

export default router     