import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuLevel1Component } from './au-level1.component';

describe('AuLevel1Component', () => {
  let component: AuLevel1Component;
  let fixture: ComponentFixture<AuLevel1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuLevel1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuLevel1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
