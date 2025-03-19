import { Response } from "express"
import { db } from "../db/db"
import { AuthenticatedRoutesHandler } from "../types/request_types"
import Section from "../models/Section"


export const get_sections: AuthenticatedRoutesHandler = async (req, res) => {
    try{

        const sections = await Section.findAll()

        res.json({message: sections})

    } catch (error) {
        handleError(res, error)
    }
}

export const create_sections: AuthenticatedRoutesHandler<{}, { movie_id: number, room_id: number, start: string, end: string, day: Date }> = async (req, res) => {
    const { movie_id, room_id, start, end, day } = req.body

    try {

        const sections = await Section.findAll({where: {day}})
        if(sections) return res.send("Já existem as seções deste filme para esse dia.")

        await db.query('CALL CreateSections(:movie_id, :room_id, :start, :end, 30)', {
            replacements: {
                movie_id,
                room_id,
                start,
                end
            }
        })

        res.json({ message: "Sessões Criadas com sucesso!" })

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