import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTestComponent } from './audit-test.component';

describe('AuditTestComponent', () => {
  let component: AuditTestComponent;
  let fixture: ComponentFixture<AuditTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
