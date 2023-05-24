import { TestBed } from '@angular/core/testing';

import { TensorflowService } from './tensorflow.service';

describe('TensorflowService', () => {
  let service: TensorflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TensorflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
