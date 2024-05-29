import { Component, OnInit } from '@angular/core';
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
  activeGenre = 'Action';

  constructor(private themoviedbService:ThemoviedbService) { }

  ngOnInit(): void {
    this.getGenres();
  }

  getGenres(){
    this.themoviedbService.getGenres()
    .subscribe({
      next: (response) => {
        console.log(response);
        this.genres = response.genres
      },
      error: (error) => {
        console.error("Error getting genres:", error);
      }
    });  
  }

  switchGenre(genre: string): void {
    this.activeGenre = genre;
  }
}
