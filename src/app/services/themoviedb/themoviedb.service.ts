import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemoviedbService {

  private apiKey = '8bea005cac9c4977ed3b41acad3136ef';

  constructor(private http: HttpClient) { }

  getGenres(): Observable<any> {
    return this.http.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apiKey}&language=en-US`);
  }
}
