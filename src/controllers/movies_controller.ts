import Movie from "../models/Movie"
import Room from "../models/Room"

type RouteMovieHandler<TParams = {}, TBody = {}, TQuery = {}> = (
    req: Request<TParams, {}, TBody, TQuery>,
    res: Response
) => Promise<Response | void>

export const get_movies: RouteMovieHandler = async (req, res) => {
    try {
        const movies = await Movie.findAll()
        res.json(movies)
    } catch (error) {
        handleError(res, error)
    }
}

export const get_rooms_movies: RouteMovieHandler = async (req, res) => {
    try {
        const movies_rooms = await Room.findAll({include: Movie})
        res.json(movies_rooms)

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