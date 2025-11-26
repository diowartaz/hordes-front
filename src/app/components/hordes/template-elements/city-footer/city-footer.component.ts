import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-city-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './city-footer.component.html',
  styleUrls: ['./city-footer.component.scss'],
})
export class CityFooterComponent implements OnInit {
  content = 'dig';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const content = localStorage.getItem('play-route');
    if (content && content.length > 0) {
      this.content = content;
    }
  }

  changeContent(content: string) {
    this.content = content;
    localStorage.setItem('play-route', content);
    this.router.navigate(['play/' + content]);
  }
}
