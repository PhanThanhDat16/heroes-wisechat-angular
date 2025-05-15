import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IRegister } from "../types/user";


@Injectable({
  providedIn: 'root',
})
export class UserService {
    private URL = 'http://localhost:3001/api/user';

    constructor(private http: HttpClient){}

    registerService(user: IRegister){
        return this.http.post<any>(`${this.URL}/register`, user)
    }

    getProfile(){
      const accessToken = localStorage.getItem('accessToken')
      return this.http.get<any>(`${this.URL}/profile`, {headers: {'authorization' : `Bearer ${accessToken}`}})
    }
}
