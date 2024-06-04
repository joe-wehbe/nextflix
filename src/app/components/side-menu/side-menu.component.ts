import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ThemoviedbService } from 'src/app/services/themoviedb/themoviedb.service';

interface Genre {
  id: number;
  name: string;
}

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
  genres: Genre[] = [];
  activeGenre = 28;

  @Output() genreIdEmitter = new EventEmitter<number>();

  constructor(private tmdbService:ThemoviedbService) { }

  ngOnInit(): void {
    this.getGenres();
  }

  getGenres(){
    this.tmdbService.getGenres()
    .subscribe({
      next: (response) => {
        this.genres = response.genres
      },
      error: (error) => {
        console.error("Error getting genres:", error);
      }
    });  
  }

  switchGenre(genreId: number): void {
    this.activeGenre = genreId;
    this.genreIdEmitter.emit(genreId);
  }
}
