import { Injectable } from '@angular/core';
import { RestService } from './rest.service';


@Injectable()
export class ConfigurationService {
	private configData: Object;


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(
		private rest: RestService
	) {
	}


	// ----------------------------------------------------------------------------------------------------
	// Read all config parameters
	// ----------------------------------------------------------------------------------------------------
	readAll() {
		return this.rest.get('/configurations')
		.map( (response) => {
			// const configData = response.json();
			this.configData = response;
			return response;
		});
	}


	// ----------------------------------------------------------------------------------------------------
	// Read a specific config parameters
	// ----------------------------------------------------------------------------------------------------
	read(configParameter: string) {
		return this.readAll()
		.map( (configData: Object) => {
			if (configData.hasOwnProperty(configParameter)) {
				return configData[configParameter];
			};
			return undefined;
		});
	}

}
