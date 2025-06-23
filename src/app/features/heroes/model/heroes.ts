import { IUser } from "../../auth/model/user"
import { ITag } from "../../tags/model/tag"

export interface IHero{
    id: number,
    name: string,
    gender: string,
    mail: string,
    age: number,
    address: string
    userId: string
    _id?: string
    tags?: ITag[]
    createdAt? : string
    userInfo?: IUser
}

export interface IHeroUpdate{
    name: string,
    gender: string,
    mail: string,
    age: number,
    address: string,
    userId?: string
    tags?: ITag[]
}