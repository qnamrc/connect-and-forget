import { JSONBasedObject } from './json-based-object';

import { InetAddress	} from './inet-address';
import { UUID	} from './uuid';

export enum ConnectionPermission {
	'Disabled',
	'Queued',
	'Enabling',
	'Enabled',
	'Disabling',
	'Reconfiguring'
}

export enum ConnectionType {
	'Shared',
	'Single'
}

export enum LinkStatus {
	'Terminated',
	'Queued',
	'Connecting',
	'Established',
	'Disconnecting',
	'Failed',
	'Recovering'
}

export interface IConnection {
	connectionGUID: UUID,
	destinationGUID: UUID,
	name: string,
	description: string,
	comments: string,
	type: ConnectionType,
	subnet: InetAddress,
	enableInstructions: string,
	// loginCustomData,
	// contacts,
	// capabilities,
	// connectionCustomData,
	// configData
	linkGUID: UUID,
	permission: ConnectionPermission,
	status: LinkStatus,
	ipAddresses: InetAddress[]
}

export class Connection extends JSONBasedObject implements IConnection {
	connectionGUID: UUID;
	destinationGUID: UUID;
	name: string;
	description: string;
	comments: string;
	type: ConnectionType;
	subnet: InetAddress;
	enableInstructions: string;
	linkGUID: UUID;
	permission: ConnectionPermission;
	status: LinkStatus;
	ipAddresses: InetAddress[];


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(json: Object = {}) {
		const fields = {
			destinationGUID: [true],
			connectionGUID: [true],
			name: [true],
			description: [false, ''],
			comments: [false, ''],
			type: [true],
			subnet: [false, undefined],
			enableInstructions: [false, ''],
			linkGUID: [false, undefined],
			permission: [false, ConnectionPermission.Disabled],
			status: [false, LinkStatus.Terminated],
			ipAddresses: [false, []]
		};
		super(json, fields);

		// Initialize typed fields

		this.connectionGUID = new UUID(json['connectionGUID']);
		this.destinationGUID = new UUID(json['destinationGUID']);

		const type = Number(ConnectionType[json['type']]);
		if (isNaN(type)) { throw SyntaxError(json['type'] + ' is not a valid ConnectionType'); } else { this.type = type; }

		if (json.hasOwnProperty('permission') && json['permission'] !== null) {
			const permission = Number(ConnectionPermission[json['permission']]);
			if (isNaN(permission)) { throw SyntaxError(json['permission'] + ' is not a valid ConnectionPermission'); } else { this.permission = permission; }
		}

		if (json.hasOwnProperty('status') && json['status'] !== null) {
			const status = Number(LinkStatus[json['status']]);
			if (isNaN(status)) { throw SyntaxError(json['status'] + ' is not a valid LinkStatus'); } else { this.status = status; }
		}

	}

}
