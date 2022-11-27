import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class WsChatService {
  open = new Subject();
  close = new Subject();
  subject: WebSocketSubject<any> = webSocket({
    url: environment.API_URL_WS + localStorage.getItem('token'),
    openObserver: this.open,
    closeObserver: this.close,
  });
  wsIsOpened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  listTypingUser$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  listMessages$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  EVENTCODES: any = {
    MESSAGE: 'message',
    TYPING: 'typing',
  };

  constructor() {
    this.connect();
    this.open.subscribe(() => this.wsIsOpened.next(true));
    this.close.subscribe(() => {
      setTimeout(() => this.connect(), 5000);
    });
  }

  connect() {
    this.subject.subscribe({
      next: (event: any) => this.eventHandler(event), // Called whenever there is a message from the server.
      error: (err: any) => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => this.onCloseHandler(), // Called when connection is closed (for whatever reason).
    });
  }

  sendMessage(message: any) {
    console.log('sendMessage ws: ', message);
    this.subject.next({ eventCode: 'message', data: message });
  }

  sendIsTyping() {
    this.subject.next({ eventCode: 'typing' });
  }

  messageReceivedHandler(event: any) {
    this.listMessages$.next([event, ...this.listMessages$.getValue()]);
  }

  typingReceivedHandler(event: any) {
    console.log('typingReceivedHandler', event);
    //event.username
    if (this.listTypingUser$.getValue().includes(event.username)) {
      this.listTypingUser$.next(
        _.without(this.listTypingUser$.getValue(), event.username)
      );
    } else {
      this.listTypingUser$.next([
        event.username,
        ...this.listTypingUser$.getValue(),
      ]);
    }
    // console.log('typingReceivedHandler', fggzg);
  }

  eventHandler(event: any) {
    switch (event.eventCode) {
      case this.EVENTCODES.MESSAGE:
        this.messageReceivedHandler(event);
        break;
      case this.EVENTCODES.TYPING:
        this.typingReceivedHandler(event);
        break;
      default:
        console.log("eventCode don't match", event);
    }
  }

  onCloseHandler() {
    setTimeout(() => {
      this.connect();
    }, 5000);
  }
}
