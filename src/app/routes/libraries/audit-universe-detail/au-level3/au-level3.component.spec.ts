import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuLevel3Component } from './au-level3.component';

describe('AuLevel3Component', () => {
  let component: AuLevel3Component;
  let fixture: ComponentFixture<AuLevel3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuLevel3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuLevel3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
