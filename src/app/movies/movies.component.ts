import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css'],
})
export class MoviesComponent implements OnInit {
  // DECLARATIONS
  movies: any[] = [];
  allMovies: any[] = [];
  currentGenres: any[] = [];
  genres: string[] = [];

  category: string = 'movie_title';
  result: string;
  gen: string;
  isAscending: boolean = true;
  isDescending: boolean;
  isStrict: boolean = true;
  isLenient: boolean;
  isResultLoaded = false;

  constructor(private resService: ReservationService) {}

  ngOnInit(): void {
    if (this.currentGenres.length == 0) {
      this.fetchMovies();
    }
    this.genreAdder();
  }

  // Fetches list of movies and sorts them alphabetically
  fetchMovies() {
    this.resService.getMovies().subscribe((resultData: any) => {
      this.isResultLoaded = true;
      this.movies = this.allMovies = resultData.data.sort((a, b) =>
        a.movie_title.localeCompare(b.movie_title)
      );
    });
  }

  // Adds the genres available from each movie to a set
  genreAdder() {
    this.resService.getMovies().subscribe((resultData: any) => {
      const genresSet = new Set<string>(); // adds the genres and makes it so it isn't duplicated

      resultData.data.forEach((obj: any) => {
        // iterates over the result to find genre key
        obj.genre.split(',').forEach((item: string) => {
          // trims genre from the database
          genresSet.add(item.trim()); // after trimming, it adds to the Set
        });
      });

      this.genres = Array.from(genresSet).sort(); // adds the Set to the original array and sorts them
    });
  }

  // Determines arrangement if ascending or descending
  arr(o: string) {
    this.isAscending = o === 'asc';
    this.isDescending = o === 'desc';
    this.sorted(this.category);
  }

  // Determines filtering if strict or lenient
  how(a: string) {
    this.isStrict = a === 'strict';
    this.isLenient = a === 'lenient';
    this.filterGenre(null);
    
  }

  // Function for trying to filter based on selected genre
  filterGenre(ge: string) {
    if (!ge) {
      // checks if null

      if (this.currentGenres.length === 0) {
        // checks if array is empty
        this.fetchMovies();
        return;
      }
    }

    if (this.currentGenres.includes(ge)) {
      // validates if selected genre is in array already to determine removal
      this.removeInstance(ge);
    } else {
      // otherwise, add to array
      this.currentGenres.push(ge);
    }

    const genreFilter = (item: any) =>
      item.genre
        .split(',')
        .map((g) => g.trim())
        .some((x) => this.currentGenres.includes(x)); // trims the genres stored
    this.movies =
      this.isLenient && this.currentGenres.length > 0
        ? this.allMovies.filter(genreFilter)
        : this.allMovies; // determines if the filtering should be lenient
    if (this.isStrict) {
      this.movies = this.movies.filter((item) =>
        this.currentGenres.every((x) => item.genre.includes(x))
      ); // filters if strict option is selected
    }
  }

  // Sort function
  sorted(value: string) {
    this.category = value; // assigns the selected value to the category
    const comparisonFn = (a: any, b: any) => {
      return (
        (this.isAscending ? 1 : -1) * (a[this.category] - b[this.category]) // Determines if it should be ascending or descending
      );
    };
    if (this.category === 'movie_title') {
      if (this.isAscending) {
        this.movies.sort(
          (a, b) =>
            comparisonFn(a, b) || a.movie_title.localeCompare(b.movie_title)
        );
      }
      else {
        this.movies.sort(
          (a, b) =>
            comparisonFn(a, b) || b.movie_title.localeCompare(a.movie_title)
          );
      }
    } else {
      this.movies.sort(comparisonFn);
    }
  }

  // Function that removes a duplicate genre
  removeInstance(re: any) {
    for (let i = this.currentGenres.length - 1; i >= 0; i--) {
      if (this.currentGenres[i] === re) {
        this.currentGenres.splice(i, 1);
      }
    }
  }
}
