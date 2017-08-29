import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import { DataService } from './data.service';
import { DataCacheService } from './data-cache.service';

import { IDestination, Destination } from '../classes/destination';
import { ISystem, System } from '../classes/system';
import { UUID } from '../../shared/classes/uuid';


@Injectable()
export class DestinationsService {
	private destinationsListSubject = new Subject<Array<IDestination>>();
	private destinationSubject = new Subject<IDestination>();
	private errorSubject = new Subject<Error>();

	private destinationsListStream = this.destinationsListSubject.asObservable();
	private destinationStream = this.destinationSubject.asObservable();
	private errorsStream = this.errorSubject.asObservable();


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(
		private data: DataService,
		private dataCache: DataCacheService
	) {
		// console.log('DestinationsService: constructor');

		// Register to errors stream and merge them
		Observable.merge(
			this.data.getErrorsStream('destinations'),
			this.dataCache.getErrorsStream('destination'),
			this.dataCache.getErrorsStream('destinations')
		)
		.subscribe( (error: Error) => this.errorSubject.next(error) );

		// Register to destinations stream
		this.dataCache.getDataStream('destinations')
		.map( (tableData: Object[]) => {
			const destinations: IDestination[] = [];
			for (const i in tableData) {
				if (tableData[i] !== undefined || tableData[i] !== null) {
					try {
						destinations.push(new Destination(tableData[i]));
					} catch (error) {
						console.log('SystemsService.getDataStream: ', error, tableData[i]);
					}
				}
			}
			return destinations;
		})
		.subscribe( (destinations: IDestination[]) => this.destinationsListSubject.next(destinations) );

		// Register to current destination stream
		this.dataCache.getDataStream('destination')
		.flatMap( (destinations: Object[]) => {
			return destinations;
		})
		.subscribe( (destination: Object) => this.destinationSubject.next(new Destination(destination)) );

	}


	// ----------------------------------------------------------------------------------------------------
	// Get stream of destination data
	// ----------------------------------------------------------------------------------------------------
	getDestinationStream(): Observable<IDestination> {
		// console.log('DestinationsService.getDestinationStream');
		return this.destinationStream;
	}


	// ----------------------------------------------------------------------------------------------------
	// Get stream of destinations
	// ----------------------------------------------------------------------------------------------------
	getDestinationsListStream(): Observable<IDestination[]> {
		// console.log('DestinationsService.getDestinationsListStream');
		return this.destinationsListStream;
	}


	// ----------------------------------------------------------------------------------------------------
	// Get stream of errors
	// ----------------------------------------------------------------------------------------------------
	getErrorsStream(): Observable<Error> {
		// console.log('DestinationsService.getErrorsStream');
		return this.errorsStream;
	}


	// ----------------------------------------------------------------------------------------------------
	// Read list of destinations
	// ----------------------------------------------------------------------------------------------------
	readList(): void {
		// console.log('DestinationsService.readList');
		this.dataCache.read('destinations');
	}


	// ----------------------------------------------------------------------------------------------------
	// Read destination data
	// ----------------------------------------------------------------------------------------------------
	read(destinationGUID: UUID): void {
		// console.log('DestinationsService.read', destinationGUID.toString());
		this.dataCache.read('destinations/' + destinationGUID.toString(), 'destination');
	}


	// ----------------------------------------------------------------------------------------------------
	// Replace destination data
	// ----------------------------------------------------------------------------------------------------
	replace(destination: IDestination): void {
		console.log('DestinationsService.replace', destination.destinationGUID.toString(), destination);
		this.data.update('destinations/' + destination.destinationGUID.toString(), destination, 'destinations');
	}


	// ----------------------------------------------------------------------------------------------------
	// Patch destination data
	// ----------------------------------------------------------------------------------------------------
	update(destinationGUID: UUID, fields: Object): void {
		console.log('DestinationsService.update', destinationGUID.toString(), fields);
		this.data.update('destinations/' + destinationGUID, fields, 'destinations');
	}

}
