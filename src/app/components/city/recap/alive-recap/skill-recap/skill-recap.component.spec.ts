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
    fixture.componentRef.setInput('skill', { name: 'Fast Learner', lvl: 1, old_lvl_max: 2, lvl_max: 3 });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
