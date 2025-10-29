import { Component, DestroyRef, inject, NgZone, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-auth-with-google',
  imports: [],
  standalone: true,
  templateUrl: './auth-with-google.component.html',
  styleUrl: './auth-with-google.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  loading = signal(false);
  invalidAuthentification = signal(false);

  constructor(
    private http: HttpClient,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    (window as any).google.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
      callback: (response: any) => this.handleGoogleResponse(response),
    });

    (window as any).google.accounts.id.renderButton(document.getElementById('google-btn'), {
      theme: 'outline',
      size: 'large',
    });
  }

  private handleGoogleResponse(response: any) {
    // response.credential is the ID token (JWT) from Google
    const idToken = response.credential;

    // Send it to your backend for verification
    this.http.post('http://localhost:8080/auth/google', { token: idToken }).subscribe({
      next: (res: any) => {
        console.log('Logged in:', res);
        // store your app's token (or set cookie if your backend issues one)
      },
      error: (err) => console.error(err),
    });
  }
}
