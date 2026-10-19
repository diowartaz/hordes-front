import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snackbar',
  templateUrl: './custom-snackbar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./custom-snackbar.component.scss'],
})
export class CustomSnackbarComponent {
  snackBarRef = inject(MatSnackBarRef);
  message = 'my message';
}
