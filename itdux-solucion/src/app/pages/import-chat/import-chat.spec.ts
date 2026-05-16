import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportChat } from './import-chat';

describe('ImportChat', () => {
  let component: ImportChat;
  let fixture: ComponentFixture<ImportChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportChat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
