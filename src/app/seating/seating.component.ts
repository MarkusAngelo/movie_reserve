import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'app-seating',
  templateUrl: './seating.component.html',
  styleUrls: ['./seating.component.css'],
})
export class SeatingComponent {
  constructor(private seatSelectionService: ReservationService) {
  
  }
  rows: number[] = this.generateRange(1, 5);

  columns: number[] = this.generateRange(1, 8);

  generateRange(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }
  selectedSeats: Set<number> = this.seatSelectionService.getSelectedSeat();// Change from number[] to Set<number>
  onSeatSelected(seatNumber: number): void {
    if (this.selectedSeats.has(seatNumber)) {
      console.log('Seat is already selected');
      return; // Don't proceed with unselecting
    }
  
    this.seatSelectionService.setSelectedSeat(seatNumber);
    console.log(this.selectedSeats);
  }
  
  
}
