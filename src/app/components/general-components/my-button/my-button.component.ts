import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-my-button',
  templateUrl: './my-button.component.html',
  styleUrls: ['./my-button.component.scss'],
})
export class MyButtonComponent implements OnInit {
  @Input() isLoading = false;
  @Input() text = '';
  @Input() textLoading = '';
  @Input() disabled = false;
  @Input() typeButton = false;
  @Input() widthpx = false;
  @Input() heightpx = false;
  @Input() icon = null;
  @Output() clickEvent = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  clicked() {
    if (this.disabled) return;
    this.clickEvent.emit();
  }
}
