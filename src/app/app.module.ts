import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Validators } from '@angular/forms';
import 'web-animations-js';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyButtonComponent } from './components/general-components/my-button/my-button.component';
// import { OuathService } from 'angular-oauth2-oidc';

//Angular components
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { HomeComponent } from './components/home/home.component';
import { LostPageComponent } from './components/lost-page/lost-page.component';
import { XpComponent } from './components/xp/xp.component';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { MenuComponent } from './components/menu/menu.component';
import { HeaderComponent } from './components/header/header.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { ChatComponent } from './components/chat/chat.component';
import { TestComponent } from './components/test/test.component';
import { LauraComponent } from './components/laura/laura.component';

@NgModule({
  declarations: [
    AppComponent,
    MyButtonComponent,
    LoginComponent,
    SignUpComponent,
    HomeComponent,
    LostPageComponent,
    XpComponent,
    MenuComponent,
    HeaderComponent,
    LeaderboardComponent,
    ChatComponent,
    TestComponent,
    LauraComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
  ],
  exports: [], //MatProgressSpinnerModule
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
