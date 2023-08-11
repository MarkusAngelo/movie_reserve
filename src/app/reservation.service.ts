import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Reserve } from './reserve';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private reserveSubject: BehaviorSubject<Reserve[]> = new BehaviorSubject<Reserve[]>([]);
  public items$: Observable<Reserve[]> = this.reserveSubject.asObservable();
  reserveInformation: string = 'http://localhost:3000/api/reservations';


  constructor(private https: HttpClient) { }
  getReservations(): Observable<any> {
    return this.https.get<any>(this.reserveInformation);
  };
  
  getMovies(): Observable<any> {
    return this.https.get("http://localhost:3000/api/movies");
  }

  movie_list: any[] = [];
  movie_info: any[] = [];
  fetchMovieInfo(movie: string) {
    return this.getMovies().subscribe((resultData: any) => {
      resultData.data.find((res) => res.movie_title === movie);
    }

    ).unsubscribe();
  }
  
  addReservation(data: any) {
    return this.https.post(`${this.reserveInformation}/add`, data);
  }

  removeReserve(id: number): Observable<any> {
    return this.https.delete(`${this.reserveInformation}/delete/${id}`);

  }

  editReserve(id: any, reservation: any) {
    return this.https.put(`${this.reserveInformation}/update/${id}`, reservation);
  }

  getInfo(id: any): Observable<any> {
    return this.https.get(`${this.reserveInformation}/${id}`);
  }

  private selectedSeat: Set<number> = new Set<number>([24, 1, 3, 5]);
  private selectedMovie: string;
  private rese: any[] = [];

  getSelectedSeat() {
    return this.selectedSeat;
  }

  setSelectedSeat(seatName: number): void {
    this.selectedSeat.add(seatName);
  }

  getSelectedMovie(): string {
    return this.selectedMovie;
  }

  setSelectedMovie(movieName: string): void {
    this.selectedMovie = movieName;
  }

  seatValidator(givenSeat: number) {
    this.getReservations().subscribe((resultData: any) => {
      this.rese = resultData.data;
      
      this.rese.find((res) => res.value === givenSeat);
    });
  }

}
