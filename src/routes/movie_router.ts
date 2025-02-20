import express from 'express'
import Movie from '../models/Movie'
import { get_movies, get_rooms_movies } from '../controllers/movies_controller'

const router = express.Router()


router.get("/", get_movies)

router.get("/rooms", get_rooms_movies)

export default router