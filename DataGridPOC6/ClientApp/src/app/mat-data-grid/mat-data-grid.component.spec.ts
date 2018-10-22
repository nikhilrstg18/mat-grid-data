import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDataGridComponent } from './mat-data-grid.component';

describe('MatDataGridComponent', () => {
  let component: MatDataGridComponent;
  let fixture: ComponentFixture<MatDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
