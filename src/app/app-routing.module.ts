import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReservationComponent } from './reservation/reservation.component';
import { InformationComponent } from './information/information.component';
import { MoviesComponent } from './movies/movies.component';
import { SeatComponent } from './seat/seat.component';
import { SeatingComponent } from './seating/seating.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'reservation',
    component: ReservationComponent,
  },
  {
    path: 'reservationDetails',
    component: InformationComponent,
  },
  {
    path: 'movie-list',
    component: MoviesComponent,
  },
  {
    path: 'seat',
    component: SeatingComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
