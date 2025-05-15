export interface IHero{
    id: number,
    name: string,
    gender: string,
    mail: string,
    age: number,
    address: string
    userId: string
    _id?: string
}

export interface IHeroUpdate{
    name: string,
    gender: string,
    mail: string,
    age: number,
    address: string,
    userId?: string
}