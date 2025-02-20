import express, { RequestHandler } from "express";
import { alter_user, create_user, delete_user, get_user, login } from "../controllers/user_controller";
import { auth } from "../middlewares/auth";

const router = express.Router()


router.post('/create', create_user)

router.post('/login', login)

router.put('/alter/:id', auth, alter_user)

router.delete('/delete/:id', auth, delete_user)

router.get('/:id', get_user)

export default router