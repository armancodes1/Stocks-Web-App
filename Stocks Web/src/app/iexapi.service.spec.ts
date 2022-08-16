import { TestBed } from '@angular/core/testing';

import { IexapiService } from './iexapi.service';

describe('IexapiService', () => {
  let service: IexapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IexapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
