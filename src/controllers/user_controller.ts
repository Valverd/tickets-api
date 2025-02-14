import { Response, Request } from "express"
import bcrypt from 'bcrypt'
import User from "../models/User"

interface UserRequestBody {
    name: string,
    email: string,
    password: string,
    birth: Date
}

export const get_user = async (req: Request, res: Response) => {
    res.send('Hello from users.')
}

export const create_user = async (req: Request<{}, {}, UserRequestBody>, res: Response) => {
    try {
        const { name, email, password, birth } = req.body

        const user_exists = await User.findOne({ where: { email } })

        if (user_exists) res.status(400).send('Usuário já existe.')

        const user = {
            name,
            email,
            password: bcrypt.hashSync(password, 10),
            birth
        }

        await User.create(user)
        res.send('Usuário Criado.')

    } catch (error) {
        console.error("Erro no create_user:", error); // Log detalhado do erro
        res.status(500).send({ message: "Erro interno no servidor", error: error.message });
    }
}

export const alter_user = async (req: Request, res: Response) => {
    try {
        const { id, name, email, password, birth } = req.body
        const user = {
            name,
            email,
            password,
            birth,
        }

        const user_exists = await User.findByPk(id)

        if (!user_exists) res.send('Usuário não encontrado.')

        await User.update(user, { where: { id } })
        res.send('Usuário alterado com sucesso.')
    } catch (error) {
        res.status(500).send(error)
    }
}

export const delete_user = async (req: Request<{}, {}, { id: number }>, res: Response) => {
    try {
        const { id } = req.body

        const user_exists = await User.findByPk(id)

        if (!user_exists) res.status(400).send('Usuário não existe.')

        await User.destroy({ where: { id } })
        res.send('Usuário deletado.')
    } catch (error) {
        res.status(500).send(error)
    }
}