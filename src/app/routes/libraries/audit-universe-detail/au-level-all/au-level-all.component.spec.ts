import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuLevelAllComponent } from './au-level-all.component';

describe('AuLevelAllComponent', () => {
  let component: AuLevelAllComponent;
  let fixture: ComponentFixture<AuLevelAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuLevelAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuLevelAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
