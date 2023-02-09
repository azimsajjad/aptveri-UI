import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTestHistoryComponent } from './audit-test-history.component';

describe('AuditTestHistoryComponent', () => {
  let component: AuditTestHistoryComponent;
  let fixture: ComponentFixture<AuditTestHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditTestHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTestHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
