import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-recap-dialog',
  templateUrl: './recap-dialog.component.html',
  styleUrls: ['./recap-dialog.component.scss'],
})
export class RecapDialogComponent {
  city: any = null;
  startDayLoading: boolean = false;
  tryAgainLoading: boolean = false;

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<RecapDialogComponent>,
    private cityService: CityService // private router: Router, // public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cityService.userPlayerCity$.subscribe((city: any) => {
      if (city) {
        this.city = city;
      }
    });
  }

  startDay() {
    if (this.startDayLoading) {
      return;
    }
    this.startDayLoading = true;
    this.cityService
      .startDay()
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        this.startDayLoading = false;
        this.dialogRef.close();
      });
  }

  tryAgain() {
    this.tryAgainLoading = true;
    this.cityService
      .delete()
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        if (result.error) {
          console.log('error delete game');
        } else {
          this.dialogRef.close();
          this.router.navigate(['create-city']);
        }
        this.tryAgainLoading = false;
      });
  }
}
