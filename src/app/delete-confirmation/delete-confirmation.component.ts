import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html'
})
export class DeleteConfirmationComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(dto: any): void {
    this.data.confirmation = 'NO';
    this.dialogRef.close(this.data);
  }

  onYesClick(dto: any): void {
    this.data.confirmation = 'YES';
    this.dialogRef.close(this.data);
  }

}
