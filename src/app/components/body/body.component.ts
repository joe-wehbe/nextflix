import { Component, OnInit } from '@angular/core';
import { ThemoviedbService } from 'src/app/services/themoviedb/themoviedb.service';

interface Movie{
  title: string;
  posterPath: string;
}

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
  upcomingMovies: Movie[] = [];
  genreId = 28;

  constructor(private tmdbService: ThemoviedbService) { }

  ngOnInit(): void {
    this.getUpcomingMoviesByGenre(this.genreId);
  }

  getUpcomingMoviesByGenre(genreId: number){
    this.tmdbService.getUpcomingMoviesByGenre(genreId)
    .subscribe({
      next: (response) => {
        this.upcomingMovies = response.results.filter((movie: { poster_path: null; }) => movie.poster_path !== null).slice(0, 7)
        .map((movie: { title: string; poster_path: string; }) => ({
          title: movie.title,
          posterPath: movie.poster_path
        }));
      },
      error: (error) => {
        console.error("Error getting upcoming movies:", error);
      }
    });  
  }

  onGenreSelection(genreId: number): void {
    this.genreId = genreId;
    this.getUpcomingMoviesByGenre(this.genreId);
  }
}
