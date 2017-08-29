import { JSONBasedObject } from './json-based-object';

import { InetAddress } from './inet-address';
import { UUID } from './uuid';

import { IOperatingSystem, OperatingSystem } from './operating-system';
import { IProtocol, Protocol } from './protocol';

export interface ISystem {
	systemGUID: UUID;
	destinationGUID: UUID;
	connectionGUID: UUID;
	name: string;
	description?: string;
	comments?: string;
	fqdn?: string;
	ipAddress: InetAddress;
	customerIpAddress: InetAddress;
	deviceIpAddress?: InetAddress;
	os?: IOperatingSystem;
	protocols?: IProtocol[];
	updateDns?: boolean;
	lastFoundUp?: Date;
}

export class System extends JSONBasedObject implements ISystem {
	systemGUID: UUID;
	destinationGUID: UUID;
	connectionGUID: UUID;
	name: string;
	description: string;
	comments: string;
	fqdn: string;
	ipAddress: InetAddress;
	customerIpAddress: InetAddress;
	deviceIpAddress: InetAddress;
	os: IOperatingSystem;
	protocols: IProtocol[];
	updateDns: boolean;
	lastFoundUp?: Date;


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(json: Object = {}) {
		const fields = {
			'systemGUID': [true],
			'destinationGUID': [true],
			'connectionGUID': [true],
			'name': [true],
			'description': [false, ''],
			'comments': [false, ''],
			'fqdn': [false, undefined],
			'ipAddress': [true],
			'customerIpAddress': [true],
			'deviceIpAddress': [false, undefined],
			'os': [false, new OperatingSystem({'name': 'unknown'})],
			'protocols': [false, [] as IProtocol[]],
			'updateDns': [false, false],
			'lastFoundUp': [false, new Date(0)]
		};
		super(json, fields);

		// Initialize typed fields

		this.systemGUID = new UUID(json['systemGUID']);
		this.destinationGUID = new UUID(json['destinationGUID']);
		this.connectionGUID = new UUID(json['connectionGUID']);
		this.ipAddress = new InetAddress(json['ipAddress']);
		this.customerIpAddress = new InetAddress(json['customerIpAddress']);

		// Initialize optional fields

		if (this.fqdn === undefined) { this.fqdn = this.name; }

		if (json.hasOwnProperty('deviceIpAddress') && json['deviceIpAddress'] !== null) {
			this.deviceIpAddress = new InetAddress(json['deviceIpAddress']);
		}

		if (json.hasOwnProperty('os') && json['os'] !== null) {
			this.os = new OperatingSystem(json['os']);
		}

		const protocols: IProtocol[] = [];
		if (json.hasOwnProperty('protocols') && json['protocols'] !== null) {
			for (let i = 0; i < json['protocols'].length; i++) {
				protocols.push(new Protocol(json['protocols'][i]));
			}
		}
		this.protocols = protocols;

	}

}
