import express from 'express'
import { create_sections, get_sections } from '../controllers/sections_controller'

const router = express.Router()

router.get("/", get_sections)

router.post("/create", create_sections)

export default router