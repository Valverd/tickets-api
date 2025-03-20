import { Response } from "express"
import { db } from "../db/db"
import { AuthenticatedRoutesHandler } from "../types/request_types"
import Section from "../models/Section"

export const get_sections: AuthenticatedRoutesHandler = async (req, res) => {
    try {

        const sections = await Section.findAll()

        res.json({ message: sections })

    } catch (error) {
        handleError(res, error)
    }
}

export const get_sections_by_date_and_movie: AuthenticatedRoutesHandler<{ day: Date, movie_id: number }> = async (req, res) => {

    const { day, movie_id } = req.params

    try {

        const sections = await db.query(`
            SELECT sc.id, m.name, sc.schedule, r.room
            FROM Sections sc
            JOIN Rooms r on r.id = sc.room_id
            JOIN Movies m on m.id = sc.movie_id
            WHERE sc.movie_id = :movie_id
            AND sc.day = :day
            `, {
            replacements: { movie_id, day },
        })

        res.json({ message: sections })

    } catch (error) {
        handleError(res, error)
    }
}


export const get_places_by_section: AuthenticatedRoutesHandler<{}> = async (req, res) => {
    const { user_id } = req
}


export const create_sections: AuthenticatedRoutesHandler<{}, { movie_id: number, room_id: number, start: string, end: string }> = async (req, res) => {
    const { movie_id, room_id, start, end } = req.body

    try {

        const today = new Date();
        let dates = []

        for (let i = 0; i < 3; i++) {

            let day_of_section = today.getDate() + i
            let date_of_section = `${today.getFullYear()}/${(today.getMonth() + 1).toString().length > 1 ? today.getMonth() + 1 : '0' + (today.getMonth() + 1)}/${day_of_section}`

            const sections = await Section.findAll({ where: { day: date_of_section } })

            if (sections.length === 0) {
                dates.push(date_of_section)

                await db.query('CALL CreateSections(:movie_id, :room_id, :date_of_section, :start, :end, 30)', {
                    replacements: {
                        movie_id,
                        room_id,
                        date_of_section,
                        start,
                        end
                    }
                })
            }

        }
        const message = dates.length > 0 ? `Sessões criadas com sucesso para os dias: ${dates.join(", ")}` : "Nenhuma sessão foi criada, pois já existem para os próximos 3 dias."

        res.json({ message })

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