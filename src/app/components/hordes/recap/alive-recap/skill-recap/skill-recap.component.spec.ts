import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillRecapComponent } from './skill-recap.component';

describe('SkillRecapComponent', () => {
  let component: SkillRecapComponent;
  let fixture: ComponentFixture<SkillRecapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SkillRecapComponent],
}).compileComponents();

    fixture = TestBed.createComponent(SkillRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
