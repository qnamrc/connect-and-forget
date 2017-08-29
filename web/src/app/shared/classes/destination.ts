import { JSONBasedObject } from './json-based-object';

import { UUID	} from './uuid';

import { IContact, Contact } from './contact';

export enum DestinationAvailability {
	'Available',
	'Unavailable',
	'Maintenance'
}

export interface IDestination {
	destinationGUID: UUID;
	name: string;
	description?: string;
	comments?: string;
	category?: string;
	contacts?: IContact[];
	availability?: DestinationAvailability;
	maintenanceNotice?: string;
	isFavorite?: boolean;
}

export class Destination extends JSONBasedObject implements IDestination {
	destinationGUID: UUID;
	name: string;
	description: string;
	comments: string;
	category: string;
	contacts: IContact[];
	availability: DestinationAvailability;
	maintenanceNotice: string;
	isFavorite?: boolean;


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(json: Object = {}) {
		const fields = {
			'destinationGUID': [true],
			'name': [true],
			'description': [false, ''],
			'comments': [false, ''],
			'category': [false, ''],
			'contacts': [false, [] as IContact[]],
			'availability': [false, DestinationAvailability.Unavailable],
			'maintenanceNotice': [false, ''],
			'isFavorite': [false, false]
		};
		super(json, fields);

		// Initialize typed fields

		this.destinationGUID = new UUID(json['destinationGUID']);

		if (json.hasOwnProperty('contacts') && json['contacts'] !== null) {
			const ca: IContact[] = [];
			for (let i = 0; i < json['contacts'].length; i++) {
				ca.push(new Contact(json['contacts'][i]));
			}
			this.contacts = ca;
		}

		if (json.hasOwnProperty('availability') && json['availability'] !== null) {
			const availability = Number(DestinationAvailability[json['availability']]);
			if (isNaN(availability)) { throw SyntaxError(json['availability'] + ' is not a valid DestinationAvailability'); } else { this.availability = availability; }
		}
		if (json.hasOwnProperty('isFavorite') && json['isFavorite'] !== null) {
			this.isFavorite = (json['isFavorite'] === 'true');
		}

	}

}

