import { Component, OnInit } from '@angular/core';
import { catchError, of, take } from 'rxjs';
import { TestService } from 'src/app/services/test/test.service';

@Component({
  selector: 'app-xp',
  templateUrl: './xp.component.html',
  styleUrls: ['./xp.component.scss'],
})
export class XpComponent implements OnInit {
  userXP: any = null;
  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.getXP();
  }

  getXP() {
    this.testService
      .getXP()
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        this.userXP = result.user.xp;
      });
  }
}
