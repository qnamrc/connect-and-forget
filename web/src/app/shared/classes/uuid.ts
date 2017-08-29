export class UUID {
	private uuidString: string;


	// ----------------------------------------------------------------------------------------------------
	// Verify UUID4 validity
	// ----------------------------------------------------------------------------------------------------
	public static isValid(uuidString: string): boolean {
		const uuidPattern = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
		return (uuidPattern.test(uuidString));
	}


	// ----------------------------------------------------------------------------------------------------
	// Pad to 4 bytes
	// ----------------------------------------------------------------------------------------------------
	private static pad4(num: number): string {
		let ret: string = num.toString(16);
		while (ret.length < 4) { ret = '0' + ret; }
		return ret;
	}


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(uuidString?: string) {

		// If we've got an initial value, use it and we're done
		if (uuidString !== undefined && uuidString !== null) {
			if (!UUID.isValid(uuidString)) { throw SyntaxError('Not a valid UUID'); }
			this.uuidString = uuidString;
			return;
		}

		// Otherwise, generate a brand new UUID
		let uuidNumber: Uint16Array = new Uint16Array(8);
		if (typeof (window) !== 'undefined' &&
				typeof (window.crypto) !== 'undefined' &&
				typeof (window.crypto.getRandomValues) !== 'undefined'
		) {

			// If we have a cryptographically secure PRNG, use that
			// http://stackoverflow.com/questions/6906916/collisions-when-generating-uuids-in-javascript
			window.crypto.getRandomValues(uuidNumber);

		} else {

			// Otherwise, just use Math.random
			// https://stackoverflow.com/questions/105034/create-uuid-uuid-in-javascript
			// https://stackoverflow.com/questions/11605068/why-does-jshint-argue-against-bitwise-operators-how-should-i-express-this-code
			uuidNumber = Uint16Array.from([
				Math.floor((1 + Math.random()) * 0x10000),
				Math.floor((1 + Math.random()) * 0x10000),
				Math.floor((1 + Math.random()) * 0x10000),
				Math.floor((1 + Math.random()) * 0x10000),
				Math.floor((1 + Math.random()) * 0x10000),
				Math.floor((1 + Math.random()) * 0x10000),
				Math.floor((1 + Math.random()) * 0x10000),
				Math.floor((1 + Math.random()) * 0x10000)
			]);
		}
		uuidNumber[3] = (uuidNumber[3] & 0x0fff) | 0x4000;	// set version to 0100
		uuidNumber[4] = (uuidNumber[4] & 0x3fff) | 0x8000;	// set bits 6-7 to 10

		// Format to string
		this.uuidString =
			UUID.pad4(uuidNumber[0]) + UUID.pad4(uuidNumber[1]) + '-' +
			UUID.pad4(uuidNumber[2]) + '-' +
			UUID.pad4(uuidNumber[3]) + '-' +
			UUID.pad4(uuidNumber[4]) + '-' +
			UUID.pad4(uuidNumber[5]) + UUID.pad4(uuidNumber[6]) + UUID.pad4(uuidNumber[7])
		;

	}


	// ----------------------------------------------------------------------------------------------------
	// Verify equivalence
	// ----------------------------------------------------------------------------------------------------
	public isEqual(uuid: UUID): boolean {
		return (this.uuidString === uuid.toString());
	}


	// ----------------------------------------------------------------------------------------------------
	// Convert to string
	// ----------------------------------------------------------------------------------------------------
	public toString(): string {
		return this.uuidString;
	}

}
