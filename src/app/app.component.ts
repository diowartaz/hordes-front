import { Component } from '@angular/core';
import { take } from 'rxjs';
import { TestService } from './services/test/test.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.testService.getXP().pipe(take(1)); //ping the server to activate it because of free hosting (render.com)
  }
}
