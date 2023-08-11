import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { ReservationService } from '../reservation.service';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
})
export class ReservationComponent implements OnInit {
  // Declarations
  reserveForm: FormGroup;
  paymentForm: FormGroup;
  gcashForm: FormGroup;
  mastercardForm: FormGroup;

  newReserve: any;
  designatedTheatre: any;
  selectedMovie: string;
  randomCode: string;
  cardNumber: string;
  invoice_price: number;
  foundReservation: boolean;

  searchedMovie = '';
  isResultLoaded = false;

  reservations: any[] = [];
  movie_list: any[] = [];
  allMovies: any[] = [];
  locations: any[] = [];
  screening: any[] = [];

  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  constructor(private fb: FormBuilder, private resService: ReservationService) {
    this.reserveForm = this.fb.group({
      id: [],
      name: ['', Validators.required],
      reserved_movie: ['', Validators.required],
      total: [],
      time: ['', Validators.required],
      location: ['', Validators.required],
      payment_method: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      date_reserved: ['', [Validators.required, futureDateValidator()]],
      input: [''],
    });
    this.mastercardForm = this.fb.group({
      card_no: ['', [Validators.required, this.creditValidator]],
      cardHolder: ['', Validators.required],
      expDate: ['', [Validators.required, futureDateValidator()]],
      card_verify: [
        [Validators.required, Validators.minLength(3), Validators.maxLength(4)],
      ],
    });
    this.gcashForm = this.fb.group({
      phoneNum: ['', [Validators.required, this.gCashValidator]],
      g_username: ['', Validators.required],
      mpin: [
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
      ],
    });
  }

  ngOnInit(): void {
    this.fetchMovies();
  }

  // Guarantees next button moves to next tab
  switchToTab(index: number): void {
    this.tabGroup.selectedIndex = index;
  }

  // Fetches list of movie from database
  fetchMovies() {
    this.resService.getMovies().subscribe((resultData: any) => {
      this.isResultLoaded = true;
      this.movie_list = this.allMovies = resultData.data;
    });
  }

  // Search function
  onChange() {
    this.movie_list = this.allMovies.filter((movie) =>
      movie.movie_title.toLowerCase().includes(this.searchedMovie.toLowerCase())
    );
  }

  // Validator for every mode of payment
  creditValidator(control: any): { [key: string]: boolean } | null {
    const value = control.value;
    const mastercardPattern = /^(5[1-5][0-9]{14})$/;

    if (!value || value === '') {
      return null; // Return null if the value is empty (no error)
    }

    if (mastercardPattern.test(value)) {
      return null; // Return null if the credit card number is valid (no error)
    } else {
      return { invalidCreditCardNumber: true }; // Return an error object if the credit card number is invalid
    }
  }

  gCashValidator(control: any): { [key: string]: boolean } | null {
    const value = control.value;
    const phoneNumPattern = /[+]63\d{10}|0\d{10}/;

    if (!value || value === '') {
      return null; // Return null if the value is empty (no error)
    }

    if (phoneNumPattern.test(value)) {
      return null; // Return null if the credit card number is valid (no error)
    } else {
      return { invalidPhoneNumber: true }; // Return an error object if the credit card number is invalid
    }
  }

  generateCode() {
    this.randomCode = this.randomString(
      15,
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+~`-='
    );
  }

  randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  // Guarantees the selection for Time and Location aligns with the Selected Movie
  onMovieSelection(): void {
    this.designatedTheatre = this.movie_list.find(
      // Assigns a value to designatedTheatre based on the selected movie
      (res) => res.movie_title === this.reserveForm.value.reserved_movie
    );
    if (this.designatedTheatre) {
      this.selectedMovie = this.designatedTheatre.availability;
      this.locations = this.selectedMovie.split(',').map((s) => s.trim());
      this.selectedMovie = this.designatedTheatre.showtime;
      this.screening = this.selectedMovie.split(',').map((s) => s.trim());
    }
    this.invoice_price = this.designatedTheatre.ticket_price;
    this.reserveForm.get('location').setValue('');
    this.reserveForm.get('time').setValue('');
  }

  // Submission
  ReserveInformation() {
    this.foundReservation = true;

    // Evaluates if new user has inputted data that have the same email, reserved movie, location, time, and date to avoid issues
    this.resService
      .getReservations()
      .subscribe((res) => (this.reservations = res.data));
    const emailExist = !!this.reservations.find(
      (res) => res.email === this.reserveForm.get('email').value
    );
    const locationExist = !!this.reservations.find(
      (res) => res.location === this.reserveForm.get('location').value
    );
    const timeExist = !!this.reservations.find(
      (res) => res.time === this.reserveForm.get('time').value
    );
    const movieExist = !!this.reservations.find(
      (res) =>
        res.reserved_movie === this.reserveForm.get('reserved_movie').value
    );
    const dateExist = !!this.reservations.find((res) => {
      const resDate = new Date(res.date_reserved);
      const formDate = new Date(this.reserveForm.get('date_reserved').value);
      return (
        resDate.getFullYear() === formDate.getFullYear() &&
        resDate.getMonth() === formDate.getMonth() &&
        resDate.getDate() === formDate.getDate()
      );
    });

    if (emailExist && locationExist && timeExist && movieExist && dateExist) {
      this.foundReservation = false;
    }

    // Evaluation if submitted form is valid
    if (
      this.reserveForm.valid &&
      (this.gcashForm.valid || this.mastercardForm.valid || this.randomCode) &&
      this.foundReservation
    ) {
      this.reserveForm
        .get('total')
        .setValue(Number(this.designatedTheatre.ticket_price));

      let data = this.reserveForm.value;
      this.resService.addReservation(data).subscribe();
      alert('Successfully reserved a movie');
      this.reserveForm.reset();
      this.invoice_price = null;
    } else if (!this.foundReservation) {
      alert('Similar reservation found');
    } else {
      let data = this.reserveForm.value;
      let nullValues = [];

      for (const key in data) {
        if (data.hasOwnProperty(key) && (data[key] === null || data[key] == '') && (key != 'id' && key != 'input')) {
          nullValues.push(key);
        }
      }

      alert('Missing properties: ' + nullValues.join(', '));
    }
  }
}

// Validates if inputted Date is the Present or a Future Date
export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    // Access the value of the date input being validated
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    const maxFutureDate = new Date(); // Set your desired maximum future date here
    maxFutureDate.setMonth(maxFutureDate.getMonth() + 6); 
maxFutureDate.setDate(31); 

    // Perform validation logic to check if the date is in the future
    if (selectedDate < currentDate || selectedDate > maxFutureDate) {
      return { futureDate: true }; // Return a validation error if the date is in the past
    }

    return null; // Return null if the date is valid (from present to future)
  };
}
