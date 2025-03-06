import express from 'express'
import { buy_ticket, see_my_tickets } from '../controllers/ticket_controller'
import { auth } from '../middlewares/auth'
const router = express.Router()

router.get("/", auth, see_my_tickets)

router.post("/buy", auth, buy_ticket)

export default router