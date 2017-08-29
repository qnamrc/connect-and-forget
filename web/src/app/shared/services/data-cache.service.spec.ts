import { TestBed, inject } from '@angular/core/testing';

import { DataCacheService } from './data-cache.service';

describe('DataCacheService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [DataCacheService]
		});
	});

	it('should be created', inject([DataCacheService], (service: DataCacheService) => {
		expect(service).toBeTruthy();
	}));
});
