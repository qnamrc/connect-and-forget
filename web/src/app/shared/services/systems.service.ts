import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs/Rx';

import { DataService } from './data.service';
import { DataCacheService } from './data-cache.service';

import { IOperatingSystem, OperatingSystem } from '../classes/operating-system';
import { ISystem, System } from '../classes/system';
import { UUID } from '../../shared/classes/uuid';


@Injectable()
export class SystemsService {
	private systemSubject = new Subject<ISystem>();
	private destinationSystemsSubject = new Subject<Array<ISystem>>();
	private errorSubject = new Subject<Error>();

	private systemStream = this.systemSubject.asObservable();
	private destinationSystemsStream = this.destinationSystemsSubject.asObservable();
	private errorsStream = this.errorSubject.asObservable();


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(
		private data: DataService,
		private dataCache: DataCacheService
	) {
		// console.log('SystemsService: constructor');

		// Register to errors stream and merge them
		Observable.merge(
			this.data.getErrorsStream('systems'),
			this.dataCache.getErrorsStream('system'),
			// this.dataCache.getErrorsStream('systems'),
			this.dataCache.getErrorsStream('destinationSystems')
		)
		.subscribe( (error: Error) => this.errorSubject.next(error) );

		// Register to current destination's systems stream
		this.dataCache.getDataStream('destinationSystems')
		.map( (tableData: Object[]) => {
			const systems: ISystem[] = [];
			for (const i in tableData) {
				if (tableData[i] !== undefined || tableData[i] !== null) {
					try {
						systems.push(new System(tableData[i]));
					} catch (error) {
						console.log('SystemsService.getDataStream: ', error, tableData[i]);
					}
				}
			}
			return systems;
		})
		.subscribe( (systems: ISystem[]) => this.destinationSystemsSubject.next(systems) );

		// Register to current system stream
		this.dataCache.getDataStream('system')
		.flatMap( (systems: Object[]) => {
			return systems;
		})
		.subscribe( (system: Object) => this.systemSubject.next(new System(system)) );

	}


	// ----------------------------------------------------------------------------------------------------
	// Get stream of system data
	// ----------------------------------------------------------------------------------------------------
	getSystemStream(): Observable<ISystem> {
		// console.log('SystemsService.getSystemStream');
		return this.systemStream;
	}


	// ----------------------------------------------------------------------------------------------------
	// Get stream of destination's systems
	// ----------------------------------------------------------------------------------------------------
	getDestinationSystemsStream(): Observable<ISystem[]> {
		// console.log('SystemsService.getDestinationSystemsStream');
		return this.destinationSystemsStream;
	}


	// ----------------------------------------------------------------------------------------------------
	// Get stream of errors
	// ----------------------------------------------------------------------------------------------------
	getErrorsStream(): Observable<Error> {
		// console.log('SystemsService.getErrorsStream');
		return this.errorsStream;
	}


	// ----------------------------------------------------------------------------------------------------
	// Read list of systems
	// ----------------------------------------------------------------------------------------------------
	readList(destinationGUID?: UUID): void {
		// console.log('SystemsService.readList');
		if (destinationGUID === undefined) {
			this.dataCache.read('systems', 'systems');
		} else {
			this.dataCache.read('destinations/' + destinationGUID.toString() + '/systems', 'destinationSystems');
		}
	}


	// ----------------------------------------------------------------------------------------------------
	// Read system data
	// ----------------------------------------------------------------------------------------------------
	read(systemGUID: UUID): void {
		// console.log('SystemsService.read', systemGUID.toString());
		this.dataCache.read('systems/' + systemGUID.toString(), 'system');
	}


	// ----------------------------------------------------------------------------------------------------
	// Replace system data
	// ----------------------------------------------------------------------------------------------------
	replace(system: ISystem): void {
		console.log('SystemsService.replace', system.destinationGUID.toString(), system);
		this.data.update('destinations/' + system.destinationGUID.toString(), system, 'systems');
	}


	// ----------------------------------------------------------------------------------------------------
	// Patch system data
	// ----------------------------------------------------------------------------------------------------
	update(systemGUID: UUID, fields: Object): void {
		console.log('SystemsService.update', systemGUID.toString(), fields);
		this.data.update('destinations/' + systemGUID, fields, 'systems');
	}

}
