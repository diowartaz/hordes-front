import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recap-header',
  templateUrl: './recap-header.component.html',
  styleUrls: ['./recap-header.component.scss']
})
export class RecapHeaderComponent {

  @Input() city: any = null;
}
