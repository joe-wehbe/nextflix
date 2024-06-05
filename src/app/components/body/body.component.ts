import { Component, OnInit } from '@angular/core';
import { ThemoviedbService } from 'src/app/services/themoviedb/themoviedb.service';

interface Movie{
  title: string;
  releaseDate: string;
  posterPath: string;
}

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
  upcomingMovies: Movie[] = [];
  upcomingTvShows: Movie[] = [];
  activeTab: String = 'movies';
  genreId = 28;

  constructor(private tmdbService: ThemoviedbService) { }

  ngOnInit(): void {
    this.getUpcomingMovies(this.genreId);
  }

  getUpcomingMovies(genreId: number){
    this.tmdbService.getUpcomingMovies(genreId)
    .subscribe({
      next: (response) => {
        console.log(response);
        this.upcomingMovies = response.results.filter((movie: { poster_path: null; }) => movie.poster_path !== null)
        .map((movie: { title: string; poster_path: string; release_date: string}) => ({
          title: movie.title,
          posterPath: movie.poster_path,
          releaseDate: movie.release_date
        }));
      },
      error: (error) => {
        console.error("Error getting upcoming movies:", error);
      }
    });  
  }

  getUpcomingTvShows(genreId: number){
    this.tmdbService.getUpcomingTVShows(genreId)
    .subscribe({
      next: (response) => {
        console.log(response);
        this.upcomingTvShows = response.results.filter((tvShow: { poster_path: null; }) => tvShow.poster_path !== null)
        .map((tvShow: { title: string; poster_path: string; release_date: string}) => ({
          title: tvShow.title,
          posterPath: tvShow.poster_path,
          releaseDate: tvShow.release_date
        }));
      },
      error: (error) => {
        console.error("Error getting upcoming movies:", error);
      }
    });  
  }

  onGenreSelection(genreId: number): void {
    this.genreId = genreId;
    this.activeTab == 'movies' ? this.getUpcomingMovies(this.genreId) : this.getUpcomingTvShows(this.genreId);
  }
}
