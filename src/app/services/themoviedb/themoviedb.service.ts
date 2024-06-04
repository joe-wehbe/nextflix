import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemoviedbService {

  private apiKey = '8bea005cac9c4977ed3b41acad3136ef';
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  getGenres(): Observable<any> {
    return this.http.get(`${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=en-US`);
  }

  getUpcomingMoviesByGenre(genreId: number): Observable<any> {
    const currentDate = new Date().toISOString().split('T')[0];
    return this.http.get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}&sort_by=release_date.desc&primary_release_date.gte=${currentDate}`);
  }
}
