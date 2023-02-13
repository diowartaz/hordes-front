import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lost-page',
  templateUrl: './lost-page.component.html',
  styleUrls: ['./lost-page.component.scss'],
})
export class LostPageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goHome() {
    this.router.navigate(['play']);
  }
}
