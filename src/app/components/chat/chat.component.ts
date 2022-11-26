import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WsChatService } from 'src/app/services/ws-chat/ws-chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  formgroup: any = null;
  isTyping: boolean = false;

  messages: any = [];
  listTypingUser: any = [];

  constructor(
    private elementRef: ElementRef,
    private wsChatService: WsChatService
  ) {}

  ngOnInit(): void {
    this.formgroup = new FormGroup({
      inputValue: new FormControl(''),
    });
    this.wsChatService.listMessages$.subscribe((res) => {
      this.messages = res;
      console.log('this.messages', this.messages);
    });

    this.wsChatService.listTypingUser$.subscribe((res) => {
      this.listTypingUser = res;
    });

    this.formgroup.controls.inputValue.valueChanges.subscribe(
      (inputValue: any) => {
        if (
          (inputValue.length > 0 && !this.isTyping) ||
          (inputValue.length === 0 && this.isTyping)
        ) {
          this.isTyping = !this.isTyping;
          this.wsChatService.sendIsTyping();
        }
      }
    );
  }

  sendMessage() {
    this.wsChatService.sendMessage(this.formgroup.controls.inputValue.value);
    this.formgroup.get('inputValue').patchValue('');
  }

  getTime(timestamp: any) {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getIsTypingString() {
    if (this.listTypingUser.length == 0) {
      return '';
    } else if (this.listTypingUser.length == 1) {
      return this.listTypingUser[0] + ' is typing...';
    } else if (this.listTypingUser.length > 3) {
      return 'Multiple users are typing...';
    } else {
      return (
        this.listTypingUser
          .map((user: any) => {
            if (user.length > 15) {
              return user.slice(0, 12) + '...';
            } else {
              return user;
            }
          })
          .join(', ') + ' are typing...'
      );
    }
  }

  // var m = document.getElementById('move');
  // m.addEventListener('mousedown', mouseDown, false);
  // window.addEventListener('mouseup', mouseUp, false);

  // client: any = new WebSocketClient();

  // this.wsChatService.connect();

  // this.elementRef.nativeElement
  //   .querySelector('my-element')
  //   .addEventListener('mouseup', this.mouseUp.bind(this));

  // this.elementRef.nativeElement
  //   .querySelector('my-element')
  //   .addEventListener('mouseup', this.mouseUp.bind(this));
  // }

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
}
