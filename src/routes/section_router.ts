import express from 'express'
import { create_sections, get_sections, get_sections_by_date_and_movie } from '../controllers/sections_controller'

const router = express.Router()

router.get("/", get_sections)

router.get("/:day/:movie_id", get_sections_by_date_and_movie)

router.post("/create", create_sections)

export default router