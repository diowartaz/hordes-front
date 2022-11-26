import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WsChatService } from 'src/app/services/ws-chat/ws-chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  // var m = document.getElementById('move');
  // m.addEventListener('mousedown', mouseDown, false);
  // window.addEventListener('mouseup', mouseUp, false);

  // client: any = new WebSocketClient();

  mystring: any = 'zazefazfeazeffeazefazefazefazefazefazef\n';

  messages: any = [
    {
      username: 'Paul',
      content: 'Yo',
      timestamp: '22:11',
    },
    {
      username: 'Vic',
      content:
        'Salut, ezfa"ezf ef efzazefafzefeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee fezfzefazef ezfazefzef fzafazefaze ezfazfe',
      timestamp: '22:12',
    },
    {
      username: 'Paul',
      content: 'Ca va?',
      timestamp: '22:13',
    },
  ];

  constructor(
    private elementRef: ElementRef,
    private wsChatService: WsChatService
  ) {}

  ngOnInit(): void {
    for (let i = 0; i < 4; i++) {
      this.messages = [...this.messages, ...this.messages];
      this.mystring = this.mystring + this.mystring;
    }

    // this.wsChatService.connect();

    // this.elementRef.nativeElement
    //   .querySelector('my-element')
    //   .addEventListener('mouseup', this.mouseUp.bind(this));

    // this.elementRef.nativeElement
    //   .querySelector('my-element')
    //   .addEventListener('mouseup', this.mouseUp.bind(this));
  }

  // mouseUp() {
  //   this.elementRef.nativeElement
  //     .querySelector('my-element')
  //     .removeEventListener('mousemove', true);
  // }

  // mouseDown() {
  //   window.addEventListener('mousemove', move, true);
  // }

  // move(e: Event) {
  //   m.style.top = e.clientY + 'px';
  //   m.style.left = e.clientX + 'px';
  // }
  // onClick(event: Event) {
  //   console.log(event);
  // }

  sendMessage() {
    this.wsChatService.sendMessage('my message omg');
  }
}
