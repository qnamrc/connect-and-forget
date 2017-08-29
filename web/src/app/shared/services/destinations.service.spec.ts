import { TestBed, inject } from '@angular/core/testing';

import { DestinationsService } from './destinations.service';

describe('DestinationsService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [DestinationsService]
		});
	});

	it('should be created', inject([DestinationsService], (service: DestinationsService) => {
		expect(service).toBeTruthy();
	}));
});
