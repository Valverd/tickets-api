import express from 'express'
import { create_sections, get_places_by_section, get_sections, get_sections_by_date_and_movie, choose_place } from '../controllers/sections_controller'
import { auth } from '../middlewares/auth'

const router = express.Router()

router.get("/", get_sections)

router.get("/:day/:movie_id", get_sections_by_date_and_movie)

router.post("/places", get_places_by_section)

router.post("/choose_place", auth, choose_place)

router.post("/create", create_sections)

export default router