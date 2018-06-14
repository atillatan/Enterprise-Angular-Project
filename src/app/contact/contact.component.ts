import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {

  animal: string;

  constructor(public dialog: MatDialog, private toastr: ToastrService) { }

  ngOnInit() {
    setTimeout(() => this.toastr.success('Hello world!', 'sdfasdfasd'));
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ExampleDialogComponent, {
      width: '250px',
      data: { animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }
}

@Component({
  selector: 'app-example-dialog-component',
  template: `
  <h1 mat-dialog-title>Hi</h1>
  <div mat-dialog-content>
    <p>What's your favorite animal?</p>
    <mat-form-field>
      <input matInput [(ngModel)]="data.animal">
    </mat-form-field>
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">No Thanks</button>
    <button mat-button [mat-dialog-close]="data.animal" cdkFocusInitial>Ok</button>
  </div>
  `
})
export class ExampleDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ExampleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
