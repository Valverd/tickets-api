import express from 'express'
import { buy_ticket } from '../controllers/ticket_controller'
const router = express.Router()

router.get("/buy", buy_ticket)

export default router