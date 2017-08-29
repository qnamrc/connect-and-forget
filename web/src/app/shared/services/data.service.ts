import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import { RequestOptions } from '@angular/http';
import { RestService } from './rest.service';


@Injectable()
export class DataService {

	private dataSubject = new Array<Subject<Object>>(0);
	private dataErrorSubject  = new Array<Subject<Error>>(0);

	private data = new Array<Observable<Object>>(0);
	private dataError = new Array<Observable<Error>>(1);


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(
		private rest: RestService
	) {

	}


	// ----------------------------------------------------------------------------------------------------
	// Initialize streams
	// ----------------------------------------------------------------------------------------------------
	private initStreams(streamName: string, streamType: string): void {

		if (streamType === 'data' || streamType === 'all') {
			if (this.dataSubject[streamName] === undefined) {
				this.dataSubject[streamName] = new Subject<Object>();
				this.data[streamName] = this.dataSubject[streamName].asObservable();
			}
		}

		if (streamType === 'errors' || streamType === 'all') {
			if (this.dataErrorSubject[streamName] === undefined) {
				this.dataErrorSubject[streamName] =  new Subject<Error>();
				this.dataError[streamName] = this.dataErrorSubject[streamName].asObservable();
			}
		}

	}


	// ----------------------------------------------------------------------------------------------------
	// Get cached data stream
	// ----------------------------------------------------------------------------------------------------
	getDataStream(streamName: string): Observable<Object> {
		this.initStreams(streamName, 'data');
		return this.data[streamName];
	}


	// ----------------------------------------------------------------------------------------------------
	// Get cache errors stream
	// ----------------------------------------------------------------------------------------------------
	getErrorsStream(streamName: string): Observable<Error> {
		this.initStreams(streamName, 'errors');
		return this.dataError[streamName];
	}


	// ----------------------------------------------------------------------------------------------------
	// Update table
	// ----------------------------------------------------------------------------------------------------
	read(uri: string, queryData?: Object, streamName?: string): void {
		// console.log('DataService: read', uri);

		// Check uri
		if ( uri === undefined ) { return; }
		if ( streamName === undefined ) { streamName = uri; }

		// Initialize streams
		this.initStreams(streamName, 'all');

		// Get fresh data from REST API
		let getOptions;
		if (queryData !== undefined) {
			getOptions = {
				'params': queryData
			} as RequestOptions;
		}
		this.rest.get('/' + uri, getOptions)
		.subscribe(
			(data: Object) => this.dataSubject[streamName].next(data),
			(error: Error) => this.dataErrorSubject[streamName].next(error)
		);

	}


	// ----------------------------------------------------------------------------------------------------
	// Update table
	// ----------------------------------------------------------------------------------------------------
	replace(uri: string, updateData: Object, streamName?: string): void {
		// console.log('DataService: replace', uri, updateData);

		// Check uri
		if ( uri === undefined ) { return; }
		if ( streamName === undefined ) { streamName = uri; }

		// Initialize streams
		this.initStreams(streamName, 'all');

		// Get fresh data from REST API
		this.rest.put('/' + uri, updateData)
		.subscribe(
			(data: Object) => this.dataSubject[streamName].next(data),
			(error: Error) => this.dataErrorSubject[streamName].next(error)
		);

	}


	// ----------------------------------------------------------------------------------------------------
	// Update table
	// ----------------------------------------------------------------------------------------------------
	update(uri: string, updateData: Object, streamName?: string): void {
		// console.log('DataService: update', uri, updateData);

		// Check uri
		if ( uri === undefined ) { return; }
		if ( streamName === undefined ) { streamName = uri; }

		// Initialize streams
		this.initStreams(streamName, 'all');

		// Get fresh data from REST API
		this.rest.patch('/' + uri, updateData)
		.subscribe(
			(data: Object) => this.dataSubject[streamName].next(data),
			(error: Error) => this.dataErrorSubject[streamName].next(error)
		);

	}

}
