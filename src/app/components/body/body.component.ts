import { Component, OnInit } from '@angular/core';
import { ThemoviedbService } from 'src/app/services/themoviedb/themoviedb.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
  upcomingMovies: any[] = [];
  genreId = 28;

  constructor(private tmdbService: ThemoviedbService) { }

  ngOnInit(): void {
    this.getUpcomingMoviesByGenre();
  }

  getUpcomingMoviesByGenre(){
    this.tmdbService.getUpcomingMoviesByGenre(this.genreId)
    .subscribe({
      next: (response) => {
        console.log(response);
        this.upcomingMovies = response.results;
      },
      error: (error) => {
        console.error("Error getting upcoming movies:", error);
      }
    });  
  }
}
