import express from 'express';
const router = express.Router()
import { loginUser, logoutUser, getProfile } from '../controllers/auth.controller.js'
import { jwtAuth } from '../middleware/jwtAuth.js'

router.post('/login', loginUser)
router.get('/logout', logoutUser)
router.get('/profile', jwtAuth, getProfile)


export default router