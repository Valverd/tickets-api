import { Response, Request } from "express"
import bcrypt from 'bcrypt'
import User from "../models/User"


type RouteHandler<TParams = {}, TBody = {}, TQuery = {}> = (
    req: Request<TParams, {}, TBody, TQuery>,
    res: Response
) => Promise<Response | void>

interface UserRequestBody {
    name: string,
    email: string,
    password: string,
    birth: Date
}

export const get_user: RouteHandler<{ id: string }> = async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findByPk(id)
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' })

        res.json(user)
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message })
        } else {
            console.log("Erro desconhecido:")
        }
    }
}

export const create_user: RouteHandler<{}, UserRequestBody> = async (req, res) => {
    try {
        const { name, email, password, birth } = req.body

        const user_exists = await User.findOne({ where: { email } })

        if (user_exists) return res.status(400).json({ message: 'Usuário já existe.' })

        const user = {
            name,
            email,
            password: bcrypt.hashSync(password, 10),
            birth
        }

        await User.create(user)
        res.json({ message: 'Usuário Criado.' })

    } catch (error: any) {
        console.error("Erro no create_user:", error); // Log detalhado do erro
        res.status(500).json({ message: "Erro interno no servidor", error: error.message });
    }
}

export const alter_user: RouteHandler<{ id: string }, UserRequestBody> = async (req, res) => {
    try {
        const { id } = req.params
        const { name, email, password, birth } = req.body
        const user = {
            name,
            email,
            password,
            birth,
        }

        const user_exists = await User.findByPk(id)

        if (!user_exists) return res.status(404).json({ message: 'Usuário não encontrado.' })

        await User.update(user, { where: { id } })
        res.json({ message: 'Usuário alterado com sucesso.' })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export const delete_user: RouteHandler<{ id: string }> = async (req, res) => {
    try {
        const { id } = req.params

        const user_exists = await User.findByPk(id)

        if (!user_exists) return res.status(404).json({ message: 'Usuário não encontrado.' })

        await User.destroy({ where: { id } })
        res.json({ message: 'Usuário deletado.' })
    } catch (error: any) {
        res.status(500).send({ message: "Erro interno no servidor", error: error.message });
    }
}

