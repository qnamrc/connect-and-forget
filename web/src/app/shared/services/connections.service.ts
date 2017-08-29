import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs/Rx';

import { DataService } from './data.service';

import { ILink, Link, LinkStatus } from '../classes/link';
import { IConnection, Connection } from '../classes/connection';
import { UUID } from '../../shared/classes/uuid';


@Injectable()
export class ConnectionsService {
	private connectionSubject = new Subject<IConnection>();
	private connectionsSubject = new Subject<Array<IConnection>>();
	private errorSubject = new Subject<Error>();

	private connectionStream = this.connectionSubject.asObservable();
	private connectionsStream = this.connectionsSubject.asObservable();
	private errorsStream = this.errorSubject.asObservable();


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(
		private data: DataService
	) {
		// console.log('ConnectionsService: constructor');

		// Register to errors stream and merge them
		Observable.merge(
			this.data.getErrorsStream('connection'),
		)
		.subscribe( (error: Error) => this.errorSubject.next(error) );

		// Register to current destination's connections stream
		this.data.getDataStream('connections')
		.map( (tableData: Object[]) => {
			const connections: IConnection[] = [];
			for (const i in tableData) {
				if (tableData[i] !== undefined || tableData[i] !== null) {
					try {
						connections.push(new Connection(tableData[i]));
					} catch (error) {
						console.log('ConnectionsService.getDataStream: ', error, tableData[i]);
					}
				}
			}
			return connections;
		})
		.subscribe( (connections: IConnection[]) => this.connectionsSubject.next(connections) );

		// Register to current connection stream
		this.data.getDataStream('connection')
		.flatMap( (connections: Object[]) => {
			return connections;
		})
		.subscribe( (connection: Object) => this.connectionSubject.next(new Connection(connection)) );

	}


	// ----------------------------------------------------------------------------------------------------
	// Get stream of connection data
	// ----------------------------------------------------------------------------------------------------
	getSystemStream(): Observable<IConnection> {
		// console.log('ConnectionsService.getSystemStream');
		return this.connectionStream;
	}


	// ----------------------------------------------------------------------------------------------------
	// Get stream of connections
	// ----------------------------------------------------------------------------------------------------
	getConnectionsStream(): Observable<IConnection[]> {
		// console.log('ConnectionsService.getConnectionsStream');
		return this.connectionsStream;
	}


	// ----------------------------------------------------------------------------------------------------
	// Get stream of errors
	// ----------------------------------------------------------------------------------------------------
	getErrorsStream(): Observable<Error> {
		// console.log('ConnectionsService.getErrorsStream');
		return this.errorsStream;
	}


	// ----------------------------------------------------------------------------------------------------
	// Read list of connections
	// ----------------------------------------------------------------------------------------------------
	readList(filter?: Object): void {
		// console.log('ConnectionsService.readList');
		this.data.read('connections', filter, 'connections');
	}


	// ----------------------------------------------------------------------------------------------------
	// Read connection data
	// ----------------------------------------------------------------------------------------------------
	read(connectionGUID: UUID): void {
		// console.log('ConnectionsService.read', connectionGUID.toString());
		this.data.read('connections/' + connectionGUID.toString(), {}, 'connection');
	}

}
