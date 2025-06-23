import { ITag } from "../../tags/model/tag"

export interface IRegister {
    username: string,
    email: string,
    password?: string
}


export interface IUser {
    _id?: string
    email: string,
    username: string,
    tags?: string[]
}

export interface IUserGet{
    _id?: string
    email: string,
    username: string,
    tags?: ITag[]
}