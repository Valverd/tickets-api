import express from 'express'
import { choose_place, get_movies, get_places_by_rooms, get_rooms_movies } from '../controllers/movie_controller'
import { auth } from '../middlewares/auth'

const router = express.Router()


router.get("/", get_movies)

router.get("/rooms", get_rooms_movies)

router.get("/places/:room_id", get_places_by_rooms)

router.post("/place", auth, choose_place)

export default router