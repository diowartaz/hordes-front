import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from 'src/app/services/auth/auth.service';

import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let authService: AuthService;
  let tempAccount: ReturnType<typeof signal<boolean>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    tempAccount = signal(true);
    (authService as any).tempAccount = tempAccount;
    spyOn(authService, 'upgradeGuest');

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function form(): HTMLFormElement | null {
    return (fixture.nativeElement as HTMLElement).querySelector('form.upgrade-card');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('affiche le formulaire de conversion seulement pour un compte invité', async () => {
    expect(form()).not.toBeNull();

    tempAccount.set(false);
    await fixture.whenStable();
    expect(form()).toBeNull();
  });

  it("n'envoie rien si le formulaire est invalide", () => {
    component.upgradeForm.setValue({
      email: 'player@example.com',
      username: '',
      password: 'password1',
      confirmPassword: 'other-password',
    });
    component.upgradeAccount();

    expect(authService.upgradeGuest).not.toHaveBeenCalled();
    expect(component.passwordsMismatch()).toBeTrue();
  });

  it('envoie email et mot de passe, sans pseudo vide', () => {
    component.upgradeForm.setValue({
      email: 'player@example.com',
      username: '',
      password: 'password1',
      confirmPassword: 'password1',
    });
    component.upgradeAccount();

    expect(authService.upgradeGuest).toHaveBeenCalledWith({ email: 'player@example.com', password: 'password1' });
  });

  it('transmet le pseudo choisi', () => {
    component.upgradeForm.setValue({
      email: 'player@example.com',
      username: 'new_name',
      password: 'password1',
      confirmPassword: 'password1',
    });
    component.upgradeAccount();

    expect(authService.upgradeGuest).toHaveBeenCalledWith({
      email: 'player@example.com',
      username: 'new_name',
      password: 'password1',
    });
  });
});
