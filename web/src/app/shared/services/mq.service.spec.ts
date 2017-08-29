import { TestBed, inject } from '@angular/core/testing';

import { MqService } from './mq.service';

describe('MqService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MqService]
    });
  });

  it('should be created', inject([MqService], (service: MqService) => {
    expect(service).toBeTruthy();
  }));
});
