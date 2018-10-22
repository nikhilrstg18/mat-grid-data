import { TestBed } from '@angular/core/testing';

import { MatDataGridService } from './mat-data-grid.service';

describe('MatDataGridService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MatDataGridService = TestBed.get(MatDataGridService);
    expect(service).toBeTruthy();
  });
});
