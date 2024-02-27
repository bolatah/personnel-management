// confirmation-dialog.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
})
export class ConfirmationDialogComponent<T> {
  @Input() data: T | undefined; 
  @Output() acceptEvent = new EventEmitter<void>();
  @Output() rejectEvent = new EventEmitter<void>();
  display: boolean = true;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
    if (this.config.data && this.config.data.data) {
      this.data = { ...this.config.data.data };
    }
  }

  accept() {
    this.acceptEvent.emit();
    if (this.data) {
      this.config.data.deleteFunction(this.data).subscribe({
        next: () => {
          console.log('Object deleted successfully.');
          this.config.data.updateList();
        },
        error: (error: any) => {
          console.error('Error deleting object:', error);
        },
      });
    }
   /*  this.ref.close(true); */
  }

  reject() {
    this.rejectEvent.emit();
    this.ref.close(false);
  }
}
