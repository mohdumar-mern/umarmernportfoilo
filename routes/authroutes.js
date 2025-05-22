import express from "express"

const router = express.Router()

import { register, login } from "../controllers/authControllers.js"
import { registerValidator } from "../validator/registerValidator.js"
import { loginValidator } from "../validator/loginValidator.js"

router.post('/register',registerValidator, register)
router.post('/login',loginValidator, login)

export default router