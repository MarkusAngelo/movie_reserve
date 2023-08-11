import { Component, OnInit } from '@angular/core';

import { ReservationService } from '../reservation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { futureDateValidator } from '../reservation/reservation.component';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css'],
})
export class InformationComponent implements OnInit {
  // Declarations
  reservations: any[] = [];
  movie_info: any[] = [];
  current_movie: any[] = [];
  locations: any[] = [];
  screening: any[] = [];

  updateForm: FormGroup;

  isResultLoaded = false;
  category: string = 'reserved_movie';
  loc: string;
  screen: string;
  currentId: number;

  isDescending: boolean;
  isAscending: boolean = true;

  constructor(private resService: ReservationService, private fb: FormBuilder) {
    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      date_reserved: ['', [Validators.required, futureDateValidator()]],
      location: ['', Validators.required],
      time: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchReservations();
  }

  // Fetches reservations made
  fetchReservations() {
    this.resService.getReservations().subscribe((resultData: any) => {
      this.reservations = resultData.data;
      this.isResultLoaded = true;
      this.setMovie();
    });
  }

  // Identifies Arrangement if ascending or descending
  arr(o: string) {
    this.isAscending = o === 'asc';
    this.isDescending = o === 'desc';
    this.sorted(this.category);
  }

  // The sorting function based on selected category
  sorted(value: string) {
    this.category = value; // assigns the selected value to the category
    if (this.category === 'reserved_movie') {
      this.reservations.sort(
        (a, b) =>
          (this.isAscending ? 1 : -1) *
          a.reserved_movie.localeCompare(b.reserved_movie)
      );
    } else if (this.category === 'name') {
      this.reservations.sort(
        (a, b) => (this.isAscending ? 1 : -1) * a.name.localeCompare(b.name)
      );
    } else if (this.category === 'date_reserved') {
      this.reservations.sort(
        (a, b) =>
          (this.isAscending ? 1 : -1) *
          a.date_reserved.localeCompare(b.date_reserved)
      );
    }
  }

  // Fetches the list of movies and filters it based on the one selected to be updated
  setMovie() {
    this.resService.getMovies().subscribe((resultData: any) => {
      this.movie_info.push(
        ...resultData.data.filter((res) => {
          return this.reservations.some((result) => {
            return result.reserved_movie === res.movie_title;
          });
        })
      );
    });
  }

  // Locates the reservation selected to be updated and assigns the value through patchValue
  editReservation(info: any) {
    this.resService.getMovies().subscribe((resultData: any) => {
      const whatMovie = info.reserved_movie;
      const givenMovie = resultData.data.find(
        (res) => res.movie_title === whatMovie
      );

      if (givenMovie) {
        this.current_movie = [givenMovie];
        this.loc = givenMovie.availability;
        this.locations = this.loc.split(',').map((s) => s.trim());
        this.screen = givenMovie.showtime;
        this.screening = this.screen.split(',').map((s) => s.trim());
      } else {
        alert('Movie not found');
        return;
      }

      this.currentId = info.id;
      this.updateForm.patchValue({
        // Retrieves and Sets the value like ngModel
        name: info.name,
        date_reserved: info.date_reserved,
        email: info.email,
        location: info.location,
        time: info.time,
      });
    });
  }

  // Delete Service

  deleteReservation(id: any) {
    if (confirm('Sure ka ba, bestie?')) {
      this.resService.removeReserve(id).subscribe((resultData: any) => {
        this.fetchReservations();
      });
    }
  }

  // Update Service
  updateInfo() {
    let data = this.updateForm.value;
    if (this.updateForm.valid) {
      this.resService
        .editReserve(this.currentId, data)
        .subscribe((res: any) => {
          this.fetchReservations();
          alert('Updated Successfully');
        });
    } else {
      alert('Error Updating Information');
    }
  }
}
