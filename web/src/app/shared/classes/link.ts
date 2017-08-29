import { JSONBasedObject } from './json-based-object';

import { IConnection, Connection } from './connection';
import { UUID } from './uuid';

export enum LinkStatus {
	'Terminated',
	'Connecting',
	'Established',
	'Disconnecting',
	'Failed',
	'Recovering'
}

export interface ILink {
	linkGUID: UUID;
	status: LinkStatus;
}

export class Link extends JSONBasedObject implements ILink {
	linkGUID: UUID;
	status: LinkStatus;


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(json: Object = {}) {
		const fields = {
			'linkGUID': [true],
			'status': [false, LinkStatus.Terminated]
		};
		super(json, fields);
		if (json === undefined || json === null ) { return undefined; }

		// Initialize typed fields

		this.linkGUID = new UUID(json['linkGUID']);

		// Initialize optional fields

		if (json.hasOwnProperty('status') && json['status'] !== null) {
			const status = Number(LinkStatus[json['status']]);
			if (isNaN(status)) { throw SyntaxError(json['status'] + ' is not a valid LinkStatus'); } else { this.status = status; }
		}

	}

}
