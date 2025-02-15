import express, { RequestHandler } from "express";
import { alter_user, create_user, delete_user, get_user } from "../controllers/user_controller";
import { auth } from "../middlewares/auth";

const router = express.Router()

router.get('/:id', auth, get_user as unknown as RequestHandler)

router.post('/create', create_user as unknown as RequestHandler)

router.put('/alter/:id', alter_user as unknown as RequestHandler)

router.delete('/delete', delete_user as unknown as RequestHandler)

export default router