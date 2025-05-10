import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IHero, IHeroUpdate } from "../types/heroes";

@Injectable({
    providedIn: "root"
})
export class HeroService{

    constructor(private http: HttpClient){}

    getHeroes(){
        const data: IHero[] = JSON.parse( localStorage.getItem('heroes') || '[]')
        return data
    }

    getDetailHero(id: number){
        const data: IHero[] = JSON.parse( localStorage.getItem('heroes') || '[]')

        const hero = data.map((h) => h.id === id)
        return hero
    }

    updateHero(id: number, value: IHeroUpdate){
        let data: IHero[] = JSON.parse( localStorage.getItem('heroes') || '[]')
        const hero = data.map((h) => h.id === id)
        if(hero){
           
        }

        

    }

    deleteHero(){

    }
}