import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'app-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.css']
})
export class SeatComponent {
  @Input() seatNumber: number;
  @Input() isSelect: boolean;
  @Output() seatSelected = new EventEmitter<number>();
  @Input() selectedSeats: Set<number>; // Change from number[] to Set<number>
  
  constructor(private resService: ReservationService){}
  
  onSeatClick(): void {
    this.seatSelected.emit(this.seatNumber);
    this.resService.setSelectedSeat(this.seatNumber);
    this.resService.seatValidator(this.seatNumber);
  }
  
  get isSelected(): boolean {
    return this.selectedSeats.has(this.seatNumber); // Check if the seat is in the Set
  }
  
  
}
