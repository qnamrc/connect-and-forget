import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { DomSanitizer } from '@angular/platform-browser';

import { SystemsService } from '../../../shared/services/systems.service';

import { ISystem, System } from '../../../shared/classes/system';
import { UUID } from '../../../shared/classes/uuid';


@Component({
	selector: 'app-system',
	templateUrl: './system.component.html',
	styleUrls: ['./system.component.scss']
})
export class SystemComponent implements OnInit, OnDestroy {
	@Input() systemGUID: UUID;

	system: ISystem;

	private	subscribedStreams: Subscription[] = [];


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(
		private activeRoute: ActivatedRoute,
		private systemsService: SystemsService
	) {
		// console.log('SystemComponent.constructor');
	}


	// ----------------------------------------------------------------------------------------------------
	// Component initializations
	// ----------------------------------------------------------------------------------------------------
	ngOnInit() {

		// Subscribe to current system stream
		this.subscribedStreams.push(this.systemsService.getSystemStream()
		.subscribe( (system: ISystem) => {
			this.system = system;
			// console.log('SystemComponent.systemStream', this.system);
		}));

		// Subscribe to get navigation changes
		this.subscribedStreams.push(this.activeRoute.params.pluck('systemGUID')
		.subscribe( (systemGUID: string) => {
			this.systemGUID = new UUID(systemGUID);
			this.systemsService.read(this.systemGUID);
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
		this.systemsService.update(this.system.systemGUID, {'comments': comments});
	}

}
