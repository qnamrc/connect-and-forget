import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { ConnectionsService } from '../../../shared/services/connections.service';
import { IConnection, Connection, ConnectionPermission, LinkStatus } from '../../../shared/classes/connection';
import { UUID } from '../../../shared/classes/uuid';


@Component({
	selector: 'app-connections',
	templateUrl: './connections.component.html',
	styleUrls: ['./connections.component.scss']
})
export class ConnectionsComponent implements OnInit, OnDestroy {
	@Input() destinationGUID: UUID;
	@Output() action = new EventEmitter<string>();

	connections: IConnection[];
	permissions = [
		'connection-disabled',			// Disabled
		'connection-transitioning',	// Queued
		'connection-transitioning',	// Enabling
		'connection-enabled',				// Enabled
		'connection-transitioning',	// Disabling
		'connection-transitioning'	// Reconfiguring
	];
	states = [
		'link-unavailable',		// Terminated
		'link-transitioning',	// Queued
		'link-transitioning',	// Connecting
		'link-available',			// Established
		'link-transitioning',	// Disconnecting
		'link-unavailable',		// Failed
		'link-transitioning',	// Recovering
	];
	ConnectionPermission: typeof ConnectionPermission = ConnectionPermission;
	LinkStatus: typeof LinkStatus = LinkStatus;

	private subscribedStreams: Subscription[] = [];


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(
		private activeRoute: ActivatedRoute,
		private connectionsService: ConnectionsService
	) {
	}


	// ----------------------------------------------------------------------------------------------------
	// Component initializations
	// ----------------------------------------------------------------------------------------------------
	ngOnInit() {

		if (this.destinationGUID === undefined) { throw new ReferenceError('destinationGUID not provided') }

		// Subscribe to connections stream
		this.subscribedStreams.push(this.connectionsService.getConnectionsStream()
		.subscribe( (connections: IConnection[]) => {
			this.connections = connections;
			// console.log('ConnectionsComponent.currentDestinationsConnectionsStream', this.connections);
		}));

		// Subscribe to get navigation changes
		this.subscribedStreams.push(this.activeRoute.params.pluck('destinationGUID')
		.subscribe( (destinationGUID: string) => {
			this.destinationGUID = new UUID(destinationGUID);
			const filter = {
				'destinationGUID': destinationGUID
			};
			this.connectionsService.readList(filter);
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

}
