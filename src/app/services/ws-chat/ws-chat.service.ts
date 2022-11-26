import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WsChatService {
  subject: WebSocketSubject<any> = webSocket(
    'ws://localhost:3000/' + localStorage.getItem('token')
  );

  constructor() {
    this.subject.subscribe({
      next: (msg: any) =>
        console.log('message received: ' + JSON.stringify(msg)), // Called whenever there is a message from the server.
      error: (err: any) => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => console.log('ws closed'), // Called when connection is closed (for whatever reason).
    });
  }

  sendMessage(message: any) {
    console.log('sendMessage ws: ', message);
    this.subject.next({ eventCode: 'message', data: message });
  }
}
