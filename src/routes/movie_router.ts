import express from 'express'
import { choose_place, get_movie_id, get_movies } from '../controllers/movie_controller'
import { auth } from '../middlewares/auth'

const router = express.Router()


router.get("/", get_movies)

router.get("/:movie_id", get_movie_id)

router.post("/place", auth, choose_place)

export default router