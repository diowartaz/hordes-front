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
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HordesComponent } from './components/hordes/hordes.component';
import { BuildingsComponent } from './components/hordes/buildings/buildings.component';
import { SkillsComponent } from './components/hordes/skills/skills.component';
import { DiggingsComponent } from './components/hordes/diggings/diggings.component';
import { InventoryComponent } from './components/hordes/inventory/inventory.component';
import { LoadGameComponent } from './components/load-game/load-game.component';
import { NoCityStartedComponent } from './components/no-city-started/no-city-started.component';
import { SettingsComponent } from './components/settings/settings.component';

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
    HordesComponent,
    BuildingsComponent,
    SkillsComponent,
    DiggingsComponent,
    InventoryComponent,
    LoadGameComponent,
    NoCityStartedComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatIconModule,
    MatIconModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
  ],
  exports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
