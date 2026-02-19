import express from 'express'
import { allUser, changePassword, forgetPassword, getUserById, login, logout, register, reTokenGenrate, updateUser, verify, verifyOtp } from '../controllers/userController.js'
import { isAdmine, isAuthenticated } from '../middleware/isAuthenticated.js'
import { singleUpload } from '../middleware/multer.js'
import { AiController } from '../controllers/aiController.js'




const router=express.Router()
router.post('/register',register)
router.post('/ai',AiController)
router.post('/verify',verify)
router.post('/reverify',reTokenGenrate)
router.post('/login',login)
router.post('/logout',isAuthenticated,logout)
router.post('/forget-password',forgetPassword)
router.post('/verify-otp/:email',verifyOtp)
router.post('/change-password/:email',changePassword)
router.get('/all-user',isAuthenticated,isAdmine,allUser)
router.get('/get-user/:userId',getUserById)
router.put('/update/:id',isAuthenticated,singleUpload,updateUser)


export default router
