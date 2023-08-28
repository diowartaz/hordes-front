import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecapHeaderComponent } from './recap-header.component';

describe('RecapHeaderComponent', () => {
  let component: RecapHeaderComponent;
  let fixture: ComponentFixture<RecapHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecapHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecapHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
