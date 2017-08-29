import { JSONBasedObject } from './json-based-object';

export interface IIPProtocolPort {
	ipProtocol: number;
	portNumber: number;
}

export class IPProtocolPort extends JSONBasedObject implements IIPProtocolPort {
	ipProtocol: number;
	portNumber: number;


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(json: Object = {}) {
		const fields = {
			'ipProtocol': [true],
			'portNumber': [true]
		};
		super(json, fields);

	}

}

