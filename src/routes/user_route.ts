import express from "express";
import { alter_user, create_user, delete_user, get_user } from "../controllers/user_controller";

const router = express.Router()

router.get('/', get_user)

router.post('/create', create_user)

router.put('/alter', alter_user)

router.delete('delete', delete_user)

export default router