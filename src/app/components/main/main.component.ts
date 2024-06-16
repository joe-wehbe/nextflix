import { Component, OnInit } from '@angular/core';
import { ThemoviedbService } from 'src/app/services/themoviedb/themoviedb.service';

interface Movie{
  id: number;
  title: string;
  releaseDate: string;
  posterPath: string;
  genres: string[];
  overview: string;
  cast: string[];
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  upcomingMovies: Movie[] = [];
  upcomingTvShows: Movie[] = [];

  activeTab: String = 'movies';
  genreId = 28;

  searchQuery: string = '';

  selectedMovieId: number = -1;

  constructor(private tmdbService: ThemoviedbService) { }

  ngOnInit(): void {
    this.getUpcomingMovies(this.genreId);
  }

  getUpcomingMovies(genreId: number): void {
  this.tmdbService.getUpcomingMovies(genreId)
    .subscribe({
      next: (response) => {
        console.log(response);
        let movies = response.results.filter((movie: { poster_path: null; }) => movie.poster_path !== null)
          .map((movie: { id: number; title: string; poster_path: string; release_date: string }) => ({
            id: movie.id,
            title: movie.title,
            posterPath: movie.poster_path,
            releaseDate: movie.release_date
          }));
        if (this.searchQuery) {
          movies = movies.filter((movie: { title: string; }) => movie.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
        }
        this.upcomingMovies = movies;
      },
      error: (error) => {
        console.error("Error getting upcoming movies:", error);
      }
    });
  }

  getUpcomingTvShows(genreId: number): void {
  this.tmdbService.getUpcomingTVShows(genreId)
    .subscribe({
      next: (response) => {
        console.log(response);
        let tvShows = response.results.filter((tvShow: { poster_path: null; }) => tvShow.poster_path !== null)
          .map((tvShow: { id: number; name: string; poster_path: string; first_air_date: string }) => ({
            id: tvShow.id,
            title: tvShow.name,
            posterPath: tvShow.poster_path,
            releaseDate: tvShow.first_air_date
          }));
        if (this.searchQuery) {
          tvShows = tvShows.filter((tvShow: { title: string; }) => tvShow.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
        }
        this.upcomingTvShows = tvShows;
      },
      error: (error) => {
        console.error("Error getting upcoming TV shows:", error);
      }
    });
  }

  getMovieDetails(movieId: number){
    this.tmdbService.getMovieDetails(movieId)
    .subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log("Error getting movie details");
      }
    });
  }

  onActiveTabSelection(activeTab: string) : void {
    this.selectedMovieId = -1;
    this.activeTab = activeTab;
    this.activeTab == 'movies' ? this.getUpcomingMovies(this.genreId) : this.getUpcomingTvShows(this.genreId);
  }

  onGenreSelection(genreId: number): void {
    this.selectedMovieId = -1;
    this.genreId = genreId;
    this.activeTab == 'movies' ? this.getUpcomingMovies(this.genreId) : this.getUpcomingTvShows(this.genreId);
  }

  onSearchQuery(query: string): void {
    this.selectedMovieId = -1;
    this.searchQuery = query;
    this.activeTab === 'movies' ? this.getUpcomingMovies(this.genreId) : this.getUpcomingTvShows(this.genreId);
  }

  selectMovie(id: number){
    this.selectedMovieId = id;
    this.getMovieDetails(this.selectedMovieId);
  }

  unselectMovie(){
    this.selectedMovieId = -1;
  }
}