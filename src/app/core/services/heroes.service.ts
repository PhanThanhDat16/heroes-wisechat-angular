import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { IHero, IHeroUpdate } from '../model/heroes';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  // private heroesSubject = new BehaviorSubject<IHero[]>([]);
  // public heroes$: Observable<IHero[]> = this.heroesSubject.asObservable();

  // private URL = 'http://localhost:3000/api/heroes';

  // constructor(private http: HttpClient) {}

  // loadHeroesService(): void {
  //   this.http
  //     .get<{ message: string; data: IHero[] }>(this.URL)
  //     .pipe(map((res) => res.data))
  //     .subscribe((data) => this.heroesSubject.next(data));
  // }

  // getHeroesService(): Observable<IHero[]> {
  //   return this.heroes$;
  // }

  // getHeroDetailService(id: string): Observable<IHero> {
  //   return this.http
  //     .get<{ message: string; data: IHero }>(`${this.URL}/${id}`)
  //     .pipe(map((res) => res.data));
  // }

  // createHeroService(hero: IHeroUpdate): Observable<IHero> {
  //   return this.http
  //     .post<{ message: string; data: IHero }>(this.URL, hero)
  //     .pipe(
  //       map((res) => res.data),
  //       tap((newHero) => {
  //         console.log(newHero);
  //         this.heroesSubject.next([...this.heroesSubject.getValue(), newHero]);
  //       })
  //     );
  // }

  // updateHeroService(id: string, hero: IHeroUpdate): Observable<IHero> {
  //   return this.http
  //     .put<{ message: string; data: IHero }>(`${this.URL}/${id}`, hero)
  //     .pipe(
  //       map((res) => res.data),
  //       tap((updatedHero) => {
  //         const current = this.heroesSubject.getValue();
  //         const updatedList = current.map((h) =>
  //           h._id === id ? updatedHero : h
  //         );
  //         this.heroesSubject.next(updatedList);
  //       })
  //     );
  // }

  // deleteHeroService(id: string): Observable<{ message: string }> {
  //   return this.http.delete<{ message: string }>(`${this.URL}/${id}`).pipe(
  //     tap(() => {
  //       const current = this.heroesSubject.getValue();
  //       const updatedList = current.filter((h) => h._id !== id);
  //       this.heroesSubject.next(updatedList);
  //     })
  //   );
  // }

  private URL = 'http://localhost:3000/api/heroes';
  private URL2 = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getHeroesByUserIdService(): Observable<IHero[]> {
    const userId = localStorage.getItem('userId');
    return this.http
      .get<{ message: string; data: IHero[] }>(
        `${this.URL2}/users/${userId}/heroes`,
        {
          headers: {
            Authorization: `Bearer ${this.authService.getAccessToken()}`,
          },
        }
      )
      .pipe(map((res) => res.data));
  }

  getHeroesService(): Observable<IHero[]> {
    return this.http
      .get<{ message: string; data: IHero[] }>(this.URL, {
        headers: {
          Authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .pipe(map((res) => res.data));
  }

  getHeroDetailService(id: string): Observable<IHero> {
    return this.http
      .get<{ message: string; data: IHero }>(`${this.URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .pipe(map((res) => res.data));
  }

  createHeroService(hero: IHeroUpdate): Observable<IHero> {
    return this.http
      .post<{ message: string; data: IHero }>(this.URL, hero, {
        headers: {
          Authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .pipe(map((res) => res.data));
  }

  updateHeroService(id: string, hero: IHeroUpdate): Observable<IHero> {
    return this.http
      .put<{ message: string; data: IHero }>(`${this.URL}/${id}`, hero, {
        headers: {
          Authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .pipe(map((res) => res.data));
  }

  deleteHeroService(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.URL}/${id}`, {
      headers: { Authorization: `Bearer ${this.authService.getAccessToken()}` },
    });
  }

  deleteManyHeroesService(
    listHeroes: string[]
  ): Observable<{ message: string; deletedCount: number }> {
    const userId = localStorage.getItem('userId');
    return this.http.delete<{ message: string; deletedCount: number }>(
      `${this.URL2}/users/${userId}/heroes`,
      {
        body: listHeroes,
        headers: {
          Authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      }
    );
  }

  // addTagsToMultipleHeroes(heroIds: string[], userId: string , tags: ITag[]) {
  //   return this.http.put(`${this.URL2}/users/${userId}/heroes/tags`, { heroIds, tags });
  // }

  // deleteTagsToMultipleHeroes(heroIds: string[], userId: string , tags: ITag[]) {
  //   return this.http.delete(`${this.URL2}/users/${userId}/heroes/tags`, {
  //     body: { heroIds, tags },
  //     headers: {
  //       Authorization: `Bearer ${this.authService.getAccessToken()}`,
  //     },
  //   });
  // }
}
