import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuLevel4Component } from './au-level4.component';

describe('AuLevel4Component', () => {
  let component: AuLevel4Component;
  let fixture: ComponentFixture<AuLevel4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuLevel4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuLevel4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
