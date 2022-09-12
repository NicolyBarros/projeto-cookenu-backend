import { Request, Response } from "express";
import { UserDatabase } from "../database/UserDatabase";
import { User, USER_ROLES } from "../models/User";
import { Authenticator, ITokenPayload } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";

export class UserController {
    public signup = async (req: Request, res: Response) => {
        let errorCode = 400
        try {
            const nickname = req.body.nickname
            const email = req.body.email
            const password = req.body.password

            if (!nickname || !email || !password) {
                errorCode = 422
                throw new Error("Parâmetros ausentes.")
            }

            if (typeof nickname !== "string") {
                errorCode = 422
                throw new Error("Parâmetro 'nickname' deve ser uma string.")
            }

            if (typeof email !== "string") {
                errorCode = 422
                throw new Error("Parâmetro 'email' deve ser uma string.")
            }

            if (typeof password !== "string") {
                errorCode = 422
                throw new Error("Parâmetro 'password' deve ser uma string.")
            }

            if (nickname.length < 3) {
                errorCode = 422
                throw new Error("Parâmetro 'nickname' deve possuir ao menos 3 caracteres.")
            }

            if (password.length < 6) {
                errorCode = 422
                throw new Error("Parâmetro 'password' deve possuir ao menos 6 caracteres.")
            }

            if (!email.includes("@") || !email.includes(".com")) {
                errorCode = 422
                throw new Error("Email inválido.")
            }

            const userDatabase = new UserDatabase()
            const userFind = await userDatabase.findByEmail(email)

            if(userFind){
                errorCode = 409
                throw new Error("Email já cadastrado.");
            }

            const idGenerator = new IdGenerator()
            const id = idGenerator.generate()

            const hashManager = new HashManager()
            const hashPassword = await hashManager.hash(password)

            const user = new User(
                id,
                nickname,
                email,
                hashPassword,
                USER_ROLES.NORMAL
            )

            await userDatabase.createUser(user)

            const payload: ITokenPayload = {
                id: user.getId(),
                role: user.getRole()
            }

            const authenticator = new Authenticator()
            const token = authenticator.generateToken(payload)

            res.status(201).send({
                message: "Cadastro realizado com sucesso!",
                token
            })
        } catch (error) {
            res.status(errorCode).send({ message: error.message })
        }
    }

    public login = async (req: Request, res: Response) => {
        let errorCode = 400
        try {
            const email = req.body.email
            const password = req.body.password

            if (!email || !password) {
                errorCode = 422
                throw new Error("Parâmetros ausentes.")
            }

            if (typeof email !== "string") {
                errorCode = 422
                throw new Error("Parâmetro 'email' deve ser uma string.")
            }

            if (typeof password !== "string") {
                errorCode = 422
                throw new Error("Parâmetro 'password' deve ser uma string.")
            }

            if (password.length < 6) {
                errorCode = 422
                throw new Error("Parâmetro 'password' deve possuir ao menos 6 caracteres.")
            }

            if (!email.includes("@") || !email.includes(".com")) {
                errorCode = 422
                throw new Error("Email inválido.")
            }

            const userDatabase = new UserDatabase()
            const userDB = await userDatabase.findByEmail(email)

            if (!userDB) {
                errorCode = 401
                throw new Error("Email não cadastrado.")
            }

            const user = new User(
                userDB.id,
                userDB.nickname,
                userDB.email,
                userDB.password,
                userDB.role
            )

            const hashManager = new HashManager()
            const isPasswordCorrect = await hashManager.compare(
                password,
                user.getPassword()
            )

            if (!isPasswordCorrect) {
                errorCode = 401
                throw new Error("Email e/ou senha inválida.")
            }

            const payload: ITokenPayload = {
                id: user.getId(),
                role: user.getRole()
            }

            const authenticator = new Authenticator()
            const token = authenticator.generateToken(payload)

            res.status(200).send({
                message: "Login realizado com sucesso!",
                token
            })
        } catch (error) {
            res.status(errorCode).send({ message: error.message })
        }
    }

    public deleteUser = async (req: Request, res: Response) => {
        let errorCode = 400
        try {
            const token = req.headers.authorization
            const id = req.params.id

            const authenticator = new Authenticator()
            const payload = authenticator.getTokenPayload(token)

            if (!payload) {
                errorCode = 401
                throw new Error("Token inválido/ausente.")
            }

            if (payload.role !== USER_ROLES.ADMIN) {
                errorCode = 403
                throw new Error("Somente admins podem acessar esse endpoint.")
            }

            const userDatabase = new UserDatabase()
            const isUserExists = await userDatabase.checkIfExistsById(id)

            if (!isUserExists) {
                errorCode = 404
                throw new Error("Usuário(a) não encontrado(a).")
            }

            if (id === payload.id) {
                errorCode = 401
                throw new Error("Não é possível deletar a própria conta.")
            }

            await userDatabase.deleteUser(id)

            res.status(200).send({
                message: "Usuário(a) deletado(a) com sucesso!"
            })
        } catch (error) {
            res.status(errorCode).send({ message: error.message })
        }
    }
}