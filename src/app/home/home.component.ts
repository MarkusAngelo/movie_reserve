import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  // Declarations
  movies: any[] = [];
  trending: any[] = [];
  throwback: any[] = [];
  acclaimed: any[] = [];

  isResultLoaded: boolean = false;

  constructor(private service: ReservationService) { }
  
  ngOnInit() {
    this.service.getMovies().subscribe((resultData: any) => {
      this.isResultLoaded = true;
      this.movies = resultData.data;
      this.specifyMovies();
    });
  }

  // Categorizes movies based on recency and score
  specifyMovies() {
    this.trending = this.movies.filter((res) => {
      return res.year >= 2022;
    });

    this.throwback = this.movies.filter((res) => {
      return res.year <= 2010;
    });

    this.acclaimed = this.movies.filter((res) => {
      return res.score >= 8;
    });
  }
}
