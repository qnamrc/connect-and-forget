import { JSONBasedObject } from './json-based-object';

import { IIPProtocolPort, IPProtocolPort } from './ip-protocol-port';

export interface IProtocol {
	// protocolId: number;
	shortDescription: string;
	description?: string;
	uri: string;
	ipPort: IIPProtocolPort;
	useInDynamicSystems?: boolean;
}

export class Protocol extends JSONBasedObject implements IProtocol {
	// protocolId: number;
	shortDescription: string;
	description: string;
	uri: string;
	ipPort: IIPProtocolPort;
	useInDynamicSystems: boolean;


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(json: Object = {}) {
		const fields = {
			// 'protocolId': [true],
			'shortDescription': [true],
			'description': [false, ''],
			'uri': [true],
			'ipPort': [true],
			'useInDynamicSystems': [false, '']
		};
		super(json, fields);

		// Initialize typed fields (optional)

		this.ipPort = new IPProtocolPort(json['ipPort']);
		if (this.useInDynamicSystems === undefined) { this.useInDynamicSystems = false; }

	}

}
