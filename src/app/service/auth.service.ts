import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IAuth } from "../types/auth";
import { map } from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private URL = 'http://localhost:3001/api/auth';

    constructor(private http: HttpClient){}

    loginService(auth: IAuth){
      return this.http.post<any>(`${this.URL}/login`, auth).pipe(
        map((data) => data.data)
      )
    }

    getAccessToken(){
      const accessToken = localStorage.getItem("accessToken")
      return accessToken
    }
}
