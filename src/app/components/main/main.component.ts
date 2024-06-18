import { Component, OnInit } from '@angular/core';
import { ThemoviedbService } from 'src/app/services/themoviedb/themoviedb.service';
import { DatePipe } from '@angular/common';

interface Movie{
  id: number;
  title: string;
  releaseDate: string;
  posterPath: string;
  genres: string[];
  overview: string;
  cast: Actor[];
}

interface TvShow{
  id: number;
  name: string;
  firstAirDate: string;
  posterPath: string;
  genres: string[];
  overview: string;
  cast: Actor[];
}

interface Actor {
  name: string;
  profilePath: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [DatePipe]
})
export class MainComponent implements OnInit {
  /***** MOVIES VARIABLES *****/
  upcomingMovies: Movie[] = [];
  selectedMovieId: number = -1;
  selectedMovie!: Movie;

  /***** TV SHOWS VARIABLES *****/
  upcomingTvShows: TvShow[] = [];
  selectedTvShowId: number = -1;
  selectedTvShow!: TvShow;

  /***** OTHER VARIABLES *****/
  activeTab: String = 'movies';
  genreId = 28;
  genreName: string = '';
  searchQuery: string = '';
  hasProfilePath: Boolean = false;

  constructor(private tmdbService: ThemoviedbService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getUpcomingMovies(this.genreId);
  }

  /******************** MOVIES FUNCTIONS ********************/
  getUpcomingMovies(genreId: number): void {
  this.tmdbService.getUpcomingMovies(genreId)
    .subscribe({
      next: (response) => {
        console.log(response);
        let movies = response.results.filter((movie: { poster_path: null; }) => movie.poster_path !== null)
          .map((movie: { id: number; title: string; poster_path: string; release_date: string }) => ({
            id: movie.id,
            title: movie.title,
            releaseDate: this.datePipe.transform(movie.release_date, 'MMMM d, y') ?? '',
            posterPath: movie.poster_path
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

  getMovieDetails(movieId: number) {
    this.tmdbService.getMovieDetails(movieId)
    .subscribe({
      next: (response: any) => {
        console.log(response);
        this.selectedMovie = {
          id: response.id,
          title: response.title,
          releaseDate: this.datePipe.transform(response.release_date, 'MMMM d, y') ?? '',
          posterPath: response.poster_path,
          genres: response.genres.map((genre: any) => genre.name).join(' | '),
          overview: response.overview,
          cast: response.credits.cast.slice(0, 12).map((cast: any) => ({name: cast.name, profilePath: cast.profile_path}))      
        };
      },
      error: (error) => {
        console.error("Error getting movie details:", error);
      }
    });
  }  

  selectMovie(id: number){
    this.selectedMovieId = id;
    this.getMovieDetails(this.selectedMovieId);
  }

  movieHasProfilePaths(): boolean {
    return this.selectedMovie?.cast?.some((actor: Actor) => actor.profilePath) ?? false;
  }

  /******************** TV SHOWS FUNCTIONS ********************/
  getUpcomingTVShows(genreId: number): void {
  this.tmdbService.getUpcomingTVShows(genreId)
    .subscribe({
      next: (response) => {
        console.log(response);
        let tvShows = response.results.filter((tvShow: { poster_path: null; }) => tvShow.poster_path !== null)
          .map((tvShow: { id: number; name: string; poster_path: string; first_air_date: string }) => ({
            id: tvShow.id,
            name: tvShow.name,
            firstAirDate: this.datePipe.transform(tvShow.first_air_date, 'MMMM d, y') ?? '',
            posterPath: tvShow.poster_path
          }));
        if (this.searchQuery) {
          tvShows = tvShows.filter((tvShow: { name: string; }) => tvShow.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
        }
        this.upcomingTvShows = tvShows;
      },
      error: (error) => {
        console.error("Error getting upcoming TV shows:", error);
      }
    });
  }

  getTvShowDetails(tvShowId: number){
    this.tmdbService.getTVShowDetails(tvShowId)
    .subscribe({
      next: (response: any) => {
        console.log(response);
        this.selectedTvShow = {
          id: response.id,
          name: response.name,
          firstAirDate: this.datePipe.transform(response.first_air_date, 'MMMM d, y') ?? '',
          posterPath: response.poster_path,
          genres: response.genres.map((genre: any) => genre.name).join(' | '),
          overview: response.overview,
          cast: response.credits.cast.slice(0, 12).map((cast: any) => ({name: cast.name, profilePath: cast.profile_path}))        
        };
      },
      error: (error) => {
        console.error("Error getting TV show details:", error);
      }
    });
  }

  selectTVShow(id: number){
    this.selectedTvShowId = id;
    this.getTvShowDetails(this.selectedTvShowId);
  }

  tvShowHasProfilePaths(): boolean {
    return this.selectedTvShow?.cast?.some((actor: Actor) => actor.profilePath) ?? false;
  } 

  /******************** OTHER FUNCTIONS ********************/
  getGenreById(genreId: number){
    this.tmdbService.getGenreById(genreId)
    .subscribe({
      next: (response: any) => {
        console.log(response);
        this.genreName = response.name;
      },
      error: (error) => {
        console.error("Error getting genre:", error);
      }
    });
  }

  onActiveTabSelection(activeTab: string) : void {
    this.back();
    this.activeTab = activeTab;
    this.activeTab == 'movies' ? this.getUpcomingMovies(this.genreId) : this.getUpcomingTVShows(this.genreId);
  }

  onGenreSelection(genreId: number): void {
    this.back();
    this.genreId = genreId;
    this.getGenreById(this.genreId);
    this.activeTab == 'movies' ? this.getUpcomingMovies(this.genreId) : this.getUpcomingTVShows(this.genreId);
  }

  onSearchQuery(query: string): void {
    this.back();
    this.searchQuery = query;
    this.activeTab === 'movies' ? this.getUpcomingMovies(this.genreId) : this.getUpcomingTVShows(this.genreId);
  }
   
  back(){
    this.selectedMovieId = -1;
    this.selectedTvShowId = -1;
  }
}