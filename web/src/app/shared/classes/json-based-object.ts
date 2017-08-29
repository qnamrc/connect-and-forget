export class JSONBasedObject {


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(json: Object = {}, fields: {}) {

		let errorMessage = '';
		for (const field in fields) {
			if (fields.hasOwnProperty(field)) {
				const isMandatory = fields[field][0];
				const fieldLower = field.toLowerCase();
				const defaultValue = (isMandatory ? undefined : fields[field][1]);

				if (!json.hasOwnProperty(field) && !json.hasOwnProperty(fieldLower)) {

					if (isMandatory) {

						// Build error message for missing fields
						errorMessage += ( (errorMessage === '' ) ? 'Missing fields: ' : ', ') + field;

					} else {

						// If field is null, set default value
						this[field] = defaultValue;
					}

				} else {

					// Add field, fixing name case
					if (json.hasOwnProperty(field)) {
						this[field] = json[field];
					} else {
						this[field] = json[fieldLower];
					}
					// If field is null, set default value
					if (this[field] === null) { this[field] = defaultValue; }

				}
			}
		}
		if (errorMessage !== '') { throw new TypeError(errorMessage); }

	}

}
