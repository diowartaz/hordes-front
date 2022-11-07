import { Component } from '@angular/core';
import { catchError, of, take } from 'rxjs';
import { TestService } from './services/test/test.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'website2';
  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.getCatFacts();
  }

  getCatFacts() {
    console.log('getCatFacts');
    this.testService
      .getCatFacts()
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        if (result.error) {
          console.log(result);
        } else {
          console.log(result);
        }
      });
  }
}
