import { JSONBasedObject } from './json-based-object';

export interface IContact {
	name: string;
	telephoneNumber: string;
}

export class Contact extends JSONBasedObject  implements IContact {
	name: string;
	telephoneNumber: string;


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(json: Object = {}) {
		const fields = {
			'name': [false, ''],
			'telephoneNumber': [false, '']
		};
		super(json, fields);

	}

}
