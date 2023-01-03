import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuLevel2Component } from './au-level2.component';

describe('AuLevel2Component', () => {
  let component: AuLevel2Component;
  let fixture: ComponentFixture<AuLevel2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuLevel2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuLevel2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
