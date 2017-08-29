import { JSONBasedObject } from './json-based-object';

import { IProtocol, Protocol } from './protocol';

export interface IOperatingSystem {
	// operatingSystemId: number;
	name: string;
	icon?: string;
}

export class OperatingSystem extends JSONBasedObject implements IOperatingSystem {
	// operatingSystemId: number;
	name: string;
	icon: string;


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(json: Object = {}) {
		const fields = {
			// 'operatingSystemId': [false, 0],
			'name': [true],
			'icon': [false, '']
		};
		super(json, fields);

		// Initialize typed fields

	}

}
