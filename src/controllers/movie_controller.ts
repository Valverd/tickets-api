import { Response } from "express"
import Movie from "../models/Movie"
import Room from "../models/Room"
import Place from "../models/Place"
import { AuthenticatedRoutesHandler } from "../types/request_types"
import memcached from "../../memcached"
import { promisify } from "util"

export const get_movies: AuthenticatedRoutesHandler = async (req, res) => {
    try {
        const movies = await Movie.findAll()
        res.json(movies)
    } catch (error) {
        handleError(res, error)
    }
}

export const get_movie_id: AuthenticatedRoutesHandler<{ movie_id: string }> = async (req, res) => {

    const { movie_id } = req.params

    try {
        const movie = await Movie.findByPk(movie_id)
        res.json({ message: "Filme encontrado", movie })
    } catch (error) {
        handleError(res, error)
    }
}


const handleError = (res: Response, error: unknown) => {
    if (error instanceof Error) {
        return res.status(500).json({ message: error.message })
    } else {
        return res.status(500).json({ message: "Erro desconhecido", error })
    }
}