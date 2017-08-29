import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Rx';

import { SystemsService } from '../../../shared/services/systems.service';
import { ISystem, System } from '../../../shared/classes/system';
import { UUID } from '../../../shared/classes/uuid';


@Component({
	selector: 'app-systems',
	templateUrl: './systems.component.html',
	styleUrls: ['./systems.component.scss']
})
export class SystemsComponent implements OnInit, OnDestroy {
	@Input() destinationGUID: UUID;

	systems: ISystem[];

	private subscribedStreams: Subscription[] = [];


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(
		private activeRoute: ActivatedRoute,
		private sanitizer: DomSanitizer,
		private systemsService: SystemsService
	) {
		// console.log('SystemsComponent.constructor');
	}


	// ----------------------------------------------------------------------------------------------------
	// Component initializations
	// ----------------------------------------------------------------------------------------------------
	ngOnInit() {
		// console.log('SystemsComponent.ngOnInit:');
		// console.log(' - destinationGUID', this.destinationGUID);

		if (this.destinationGUID === undefined) { throw new ReferenceError('destinationGUID not provided') }
		this.systemsService.readList(this.destinationGUID);

		// Subscribe to systems stream
		this.subscribedStreams.push(this.systemsService.getDestinationSystemsStream()
		.subscribe( (systems: ISystem[]) => {
			this.systems = systems;
			// console.log('SystemsComponent.currentDestinationsSystemsStream', this.systems);
		}));

		// Subscribe to get navigation changes
		this.subscribedStreams.push(this.activeRoute.params.pluck('destinationGUID')
		.subscribe( (destinationGUID: string) => {
			this.destinationGUID = new UUID(destinationGUID);
			this.systemsService.readList(this.destinationGUID);
		}));

	}


	// ----------------------------------------------------------------------------------------------------
	// Final operations
	// ----------------------------------------------------------------------------------------------------
	ngOnDestroy() {
		// Unsubscribe from all streams
		this.subscribedStreams.forEach( (subscription: Subscription) => {
			subscription.unsubscribe();
		});
	}


	// ----------------------------------------------------------------------------------------------------
	// Mark URL as safe
	// ----------------------------------------------------------------------------------------------------
	sanitizeUrl(url: string) {
		return this.sanitizer.bypassSecurityTrustUrl(url);
	}

}
