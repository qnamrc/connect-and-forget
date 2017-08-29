import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { DestinationsService } from '../../shared/services/destinations.service';

import { IDestination, Destination } from '../../shared/classes/destination';
import { UUID } from '../../shared/classes/uuid';


@Component({
	selector: 'app-destination',
	templateUrl: './destination.component.html',
	styleUrls: ['./destination.component.scss']
})
export class DestinationComponent implements OnInit, OnDestroy {
	destination: IDestination;
	destinationGUID: UUID;
	systemGUID: UUID;

	private	subscribedStreams: Subscription[] = [];


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(
		private activatedRoute: ActivatedRoute,
		private destinationsService: DestinationsService,
		private router: Router
	) {
		// console.log('DestinationComponent.constructor:');
		// console.log(' - destinationGUID', this.destinationGUID, '=>', this.activatedRoute.snapshot.paramMap.get('destinationGUID'));
		// console.log(' - systemGUID', this.systemGUID, '=>', this.activatedRoute.snapshot.paramMap.get('systemGUID'));

		// Verify parameters
		const routeParams = this.activatedRoute.snapshot.paramMap;
		if (!routeParams.has('destinationGUID')) { this.router.navigate(['/']) };

		// Store parameters
		this.destinationGUID = new UUID(routeParams.get('destinationGUID'));
		if (routeParams.has('systemGUID')) {
			this.systemGUID = new UUID(routeParams.get('systemGUID'));
		}

	}


	// ----------------------------------------------------------------------------------------------------
	// Component initializations
	// ----------------------------------------------------------------------------------------------------
	ngOnInit() {
		// console.log('DestinationComponent.ngOnInit');

		// Subscribe to destination stream
		this.subscribedStreams.push(this.destinationsService.getDestinationStream()
		.subscribe( (destination: IDestination) => {
			this.destination = destination;
			// this.destinationGUID.isEqual(destination.destinationGUID);
			// console.log('DestinationComponent.currentDestinationStream', this.destination);
		}));

		// Subscribe to get navigation changes
		this.subscribedStreams.push(this.activatedRoute.params.pluck('destinationGUID')
		.subscribe( (destinationGUID: string) => {
			this.destinationGUID = new UUID(destinationGUID);
			this.destinationsService.read(this.destinationGUID);
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
	// Store comment changes
	// ----------------------------------------------------------------------------------------------------
	commentsChanged(comments: string): void {
		this.destinationsService.update(this.destination.destinationGUID, {'comments': comments});
	}


	// ----------------------------------------------------------------------------------------------------
	// Toggle favorite flag
	// ----------------------------------------------------------------------------------------------------
	toggleFavorite() {
		this.destination.isFavorite = !this.destination.isFavorite;
		this.destinationsService.update(this.destination.destinationGUID, {'isFavorite': this.destination.isFavorite});
	}

}
