import { Request, Response } from "express"

export interface AuthenticatedRequest<TParams, TBody, TQuery> extends Request<TParams, {}, TBody, TQuery> {
    user_id: string
}

export type AuthenticatedRoutesHandler<TParams = {}, TBody = {}, TQuery = {}> = (
    req: AuthenticatedRequest<TParams, TBody, TQuery>,
    res: Response
) => Promise<Response | void>
