import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectProfile } from './prospect-profile';

describe('ProspectProfile', () => {
  let component: ProspectProfile;
  let fixture: ComponentFixture<ProspectProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProspectProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProspectProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
