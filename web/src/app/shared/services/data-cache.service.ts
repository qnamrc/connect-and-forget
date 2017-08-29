import { Injectable, OnDestroy } from '@angular/core';
import { LocalStorageService } from 'ngx-localstorage';
import { Observable, Subject } from 'rxjs/Rx';
import { MqttMessage } from 'ngx-mqtt';

import { MqService } from './mq.service';
import { RestService } from './rest.service';


@Injectable()
export class DataCacheService {

	private cachedDataSubject = new Array<Subject<Object>>(0);
	private cachedDataErrorSubject  = new Array<Subject<Error>>(0);

	private cachedData = new Array<Observable<Object>>(0);
	private cachedDataError = new Array<Observable<Error>>(1);


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(
		private storage: LocalStorageService,
		private mq: MqService,
		private rest: RestService
	) {
		// console.log('DataCacheService: constructor');
	}


	// ----------------------------------------------------------------------------------------------------
	// Initialize streams
	// ----------------------------------------------------------------------------------------------------
	private initStreams(streamName: string, streamType: string): void {

		if (streamType === 'data' || streamType === 'all') {
			if (this.cachedDataSubject[streamName] === undefined) {
				this.cachedDataSubject[streamName] = new Subject<Object>();
				this.cachedData[streamName] = this.cachedDataSubject[streamName].asObservable();
			}
		}

		if (streamType === 'errors' || streamType === 'all') {
			if (this.cachedDataErrorSubject[streamName] === undefined) {
				this.cachedDataErrorSubject[streamName] =  new Subject<Error>();
				this.cachedDataError[streamName] = this.cachedDataErrorSubject[streamName].asObservable();
			}
		}

	}


	// ----------------------------------------------------------------------------------------------------
	// Read table data
	// ----------------------------------------------------------------------------------------------------
	read(uri: string, streamName?: string): void {
		// console.log('DataCacheService: read', uri, streamName);

		// Check uri
		if ( uri === undefined ) { return; }
		if ( streamName === undefined ) { streamName = uri; }

		// Initialize streams
		this.initStreams(streamName, 'all');

		// Try to read from local storage
		const cachedData = this.storage.get(uri, 'tableCache');
		if (cachedData === null) {

			// Fallback to read from REST service
			this.rest.get('/tablescache/' + uri)
			.subscribe(
				(data: Object) => {

				// Update local copy
				this.storage.set(uri, JSON.stringify(data), 'tableCache')

				// Notify subscribers of new data
				this.cachedDataSubject[streamName].next(data)
				},
				(error: Error) => {

				// Notify subscribers of errors
				this.cachedDataErrorSubject[streamName].next(error)
				}
			);
		} else {
			// console.log('DataCacheService: return cachedData', uri);

			// Return cached data (json format)
			this.cachedDataSubject[streamName].next(JSON.parse(cachedData));

		}

	}


	// ----------------------------------------------------------------------------------------------------
	// Get cached data stream
	// ----------------------------------------------------------------------------------------------------
	getDataStream(streamName: string): Observable<Object> {
		this.initStreams(streamName, 'data');
		return this.cachedData[streamName];
	}


	// ----------------------------------------------------------------------------------------------------
	// Get cache errors stream
	// ----------------------------------------------------------------------------------------------------
	getErrorsStream(streamName: string): Observable<Error> {
		this.initStreams(streamName, 'errors');
		return this.cachedDataError[streamName];
	}

}
