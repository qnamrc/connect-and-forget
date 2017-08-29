import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs/Rx';

import { DataService } from './data.service';

import { ILink, Link, LinkStatus } from '../classes/link';
import { UUID } from '../../shared/classes/uuid';


@Injectable()
export class LinksService {
	private linkSubject = new Subject<ILink>();
	private linksSubject = new Subject<Array<ILink>>();
	private errorSubject = new Subject<Error>();

	private linkStream = this.linkSubject.asObservable();
	private linksStream = this.linksSubject.asObservable();
	private errorsStream = this.errorSubject.asObservable();


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(
		private data: DataService
	) {
		// console.log('LinksService: constructor');

		// Register to errors stream and merge them
		Observable.merge(
			this.data.getErrorsStream('link'),
		)
		.subscribe( (error: Error) => this.errorSubject.next(error) );

		// Register to current destination's links stream
		this.data.getDataStream('links')
		.map( (tableData: Object[]) => {
			const links: ILink[] = [];
			for (const i in tableData) {
				if (tableData[i] !== undefined || tableData[i] !== null) {
					try {
						links.push(new Link(tableData[i]));
					} catch (error) {
						console.log('LinksService.getDataStream: ', error, tableData[i]);
					}
				}
			}
			return links;
		})
		.subscribe( (links: ILink[]) => this.linksSubject.next(links) );

		// Register to current link stream
		this.data.getDataStream('link')
		.flatMap( (links: Object[]) => {
			return links;
		})
		.subscribe( (link: Object) => this.linkSubject.next(new Link(link)) );

	}


	// ----------------------------------------------------------------------------------------------------
	// Get stream of link data
	// ----------------------------------------------------------------------------------------------------
	getSystemStream(): Observable<ILink> {
		// console.log('LinksService.getSystemStream');
		return this.linkStream;
	}


	// ----------------------------------------------------------------------------------------------------
	// Get stream of links
	// ----------------------------------------------------------------------------------------------------
	getLinksStream(): Observable<ILink[]> {
		// console.log('LinksService.getLinksStream');
		return this.linksStream;
	}


	// ----------------------------------------------------------------------------------------------------
	// Get stream of errors
	// ----------------------------------------------------------------------------------------------------
	getErrorsStream(): Observable<Error> {
		// console.log('LinksService.getErrorsStream');
		return this.errorsStream;
	}


	// ----------------------------------------------------------------------------------------------------
	// Read list of links
	// ----------------------------------------------------------------------------------------------------
	readList(filter?: Object): void {
		// console.log('LinksService.readList');
		this.data.read('links', filter, 'links');
	}


	// ----------------------------------------------------------------------------------------------------
	// Read link data
	// ----------------------------------------------------------------------------------------------------
	read(linkGUID: UUID): void {
		// console.log('LinksService.read', linkGUID.toString());
		this.data.read('links/' + linkGUID.toString(), {}, 'link');
	}

}
