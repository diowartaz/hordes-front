import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecapDialogComponent } from './recap-dialog.component';

describe('RecapDialogComponent', () => {
  let component: RecapDialogComponent;
  let fixture: ComponentFixture<RecapDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecapDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecapDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
