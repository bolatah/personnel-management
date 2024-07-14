import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Employee } from '../models/employee.model';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
})
export class ConfirmationDialogComponent {
  @Output() acceptEvent = new EventEmitter<void>();
  @Output() rejectEvent = new EventEmitter<void>();

  display: boolean = true;

  constructor(
    public ref: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {action: string , item : Employee | User, serviceMethode : () => Observable<any>}
  ) {}

  accept() {
    this.acceptEvent.emit();    
     if (this.data.action === 'Delete' && this.data.item ) {
      this.data.serviceMethode().subscribe({
        next: () => {
          console.log('Object deleted successfully.');
          this.ref.close(this.data.item);
        },
        error: (error: any) => {
          console.error('Error deleting object:', error);
          this.display = true;
        },
      });
    } 
    this.ref.close(); 
  }

  reject() {
    this.rejectEvent.emit();
    this.ref.close();
  }
}
