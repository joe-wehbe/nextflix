import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.local';

@Injectable({
  providedIn: 'root'
})
export class ThemoviedbService {

  private apiKey = environment.apiKey;
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  /************** MOVIES APIs **************/
  getUpcomingMovies(genreId: number): Observable<any> {
    const currentDate = new Date().toISOString().split('T')[0];
    return this.http.get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}&sort_by=release_date.desc&primary_release_date.gte=${currentDate}`);
  }

  getMovieDetails(movieId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}&append_to_response=credits`);
  }

  /************** TV SHOWS APIs **************/
  getUpcomingTVShows(genreId: number): Observable<any> {
    const currentDate = new Date().toISOString().split('T')[0];
    return this.http.get(`${this.baseUrl}/discover/tv?api_key=${this.apiKey}&with_genres=${genreId}&sort_by=first_air_date.desc&first_air_date.gte=${currentDate}`);
  }  

  getTVShowDetails(tvId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/tv/${tvId}?api_key=${this.apiKey}&append_to_response=credits`);
  }

  /************** OTHER APIs **************/
  getGenres(): Observable<any> {
    return this.http.get(`${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=en-US`);
  }  

  getGenreById(genreId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/genre/${genreId}?api_key=${this.apiKey}`);
  }
}
