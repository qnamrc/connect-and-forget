// ----------------------------------------------------------------------------------------------------
// IPv4
// ----------------------------------------------------------------------------------------------------
export class IPv4 {
	private address = 0;
	private binMask = 0;
	private subnetMask = 0;
	private networkAddress = 0;
	private broadcastAddress = 0;


	private static padBinary(binary: string, padDigit: string, padLength: number, leading: boolean = true): string {
		for (let i = 0; i < padLength; i++) {
			if (leading) {
				binary = padDigit + binary;
			} else {
				binary = binary + padDigit;
			}
		}

		return binary;
	}

	private static byteToBinary(text: string): string {
		const dec = parseInt(text, 10);
		let bin = dec.toString(2);

		if (text === '' || dec < 0 || dec > 255) {
			throw new SyntaxError('out of range');
		}

		bin = IPv4.padBinary(bin, '0', 8 - bin.length);

		return bin;
	}

	private static binaryToDecimal(text: string): number {
		const dec = parseInt(text, 2);

		if (text === '' || dec < 0 || dec > 255) {
			throw new SyntaxError('out of range');
		}

		return dec;
	}

	private static dottedToDecimal(dot: string[]): number {
		let bin = '', dec;

		for (let i = 0; i < 4; i++) {
			bin = bin + IPv4.byteToBinary(dot[i]);
		}

		dec = parseInt(bin, 2) >>> 0;

		return dec;
	}

	private static decimalToDotted(decimal: number, binary: boolean): string {
		const dot = [];
		let bin = decimal.toString(2);

		bin = IPv4.padBinary(bin, '0', 32 - bin.length);

		for (let i = 0; i < 4; i++) {
			if (!binary) {
				dot[i] = IPv4.binaryToDecimal(bin.substr(8 * i, 8));
			} else {
				dot[i] = bin.substr(8 * i, 8);
			}
		}

		return dot.join('.');
	}

	private static cidrToDecimal(binMask: number): number {
		let bin = '', dec;

		if (binMask < 0 || binMask > 32) {
			throw new SyntaxError('out of range (CIDR)');
		}

		for (let i = 0; i < 32; i++) {
			if (i < binMask) {
				bin = bin + '1';
			} else {
				bin = bin + '0';
			}
		}

		dec = parseInt(bin, 2) >>> 0;

		return dec;
	}

	private static decimalToCidr(decimal: number): number {
		let binMask = 0, bin = decimal.toString(2), border = false;

		bin = IPv4.padBinary(bin, '0', 32 - bin.length);

		for (let i = 0; i < 32; i++) {
			if (bin[i] === '1' && !border) {
				binMask++;
			} else if (bin[i] === '0') {
				border = true;
			} else {
				throw new SyntaxError('invalid subnet mask');
			}
		}

		return binMask;
	}


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(ipAddressString: string) {

		const bytes = ipAddressString.replace(/(\.|\/| )/g, '.').split('.');

		switch (bytes.length) {

			case 4:	// aaa.aaa.aaa.aaa
			this.binMask = 32;
			this.subnetMask = IPv4.cidrToDecimal(32);
			break;

			case 5:	// aaa.aaa.aaa.aaa/mm
			this.binMask = parseInt(bytes[4], 10);
			this.subnetMask = IPv4.cidrToDecimal(this.binMask);
			break;

			case 8:	// aaa.aaa.aaa.aaa/mmm.mmm.mmm.mmm
			this.subnetMask = IPv4.dottedToDecimal(bytes.slice(4, 8));
			this.binMask = IPv4.decimalToCidr(this.subnetMask);
			break;

			default:
			throw new SyntaxError('Invalid IPv4 address');

		}

		this.address = IPv4.dottedToDecimal(bytes.slice(0, 4));
		this.networkAddress = (this.address & this.subnetMask) >>> 0;
		this.broadcastAddress = (this.address | ~this.subnetMask) >>> 0;

	}


	public getAddress(binary: boolean): string {
		return IPv4.decimalToDotted(this.address, binary);
	}

	public getBroadcastAddress(binary: boolean): string {
		return IPv4.decimalToDotted(this.broadcastAddress, binary);
	}

	public getCIDR(): number {
		return this.binMask;
	}

	public getNetworkAddress(binary: boolean): string {
		return IPv4.decimalToDotted(this.networkAddress, binary);
	}

	public getSubnetMask(binary: boolean): string {
		return IPv4.decimalToDotted(this.subnetMask, binary);
	}

	// public getHostsRange(binary: boolean): string[] {
	// 	if (this.binMask <= 30) {
	// 		return [
	// 			IPv4.decimalToDotted(this.networkAddress + 1, binary),
	// 			IPv4.decimalToDotted(this.broadcastAddress - 1, binary)
	// 		];
	// 	}
	// }

	// public getHostsCount(): number {
	// 	if (this.binMask <= 30) {
	// 		return this.broadcastAddress - this.networkAddress - 1;
	// 	} else {
	// 		return 0;
	// 	}
	// }

	public toString(binary: boolean = false) {
		return IPv4.decimalToDotted(this.address, binary);
	}

}



// ----------------------------------------------------------------------------------------------------
// IPv6
// ----------------------------------------------------------------------------------------------------
export class IPv6 {
	private ipv6AddressString;

	constructor(ipv6AddressString: string) {
		this.ipv6AddressString = ipv6AddressString;	// TODO: implement
	}

	public getAddress(binary: boolean): string {
		return ''; // TODO: implement
	}

	public getBroadcastAddress(binary: boolean): string {
		return ''; // TODO: implement
	}

	public getCIDR(): number {
		return 0; // TODO: implement
	}

	public getNetworkAddress(binary: boolean): string {
		return ''; // TODO: implement
	}

	public getSubnetMask(binary: boolean): string {
		return ''; // TODO: implement
	}

	// public getHostsRange(binary: boolean): string[] {
	// }

	// public getHostsCount(): number {
	// }

	public toString(binary: boolean = false) {
		return ''; // TODO: implement
	}

}


// ----------------------------------------------------------------------------------------------------
// InetAddress (IPv4 + IPv6)
// ----------------------------------------------------------------------------------------------------
export class InetAddress {
	private version: number;
	private ipv4: IPv4;
	private ipv6: IPv6;

	constructor(ipAddressString: string) {
		const ip = ipAddressString.split('/');
		const ipv4AddressR = new RegExp(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/);
		const ipv6AddressR = new RegExp(/^((?:[0-9a-f]{1,4}))((?::[0-9a-f]{1,4}))*::((?:[0-9a-f]{1,4}))((?::[0-9a-f]{1,4}))*|((?:[0-9a-f]{1,4}))((?::[0-9a-f]{1,4})){7}$/i);

		if (ipv4AddressR.test(ip[0])) {
			if (ip.length > 1) {
				const ipv4NetmaskR = new RegExp(/^(254|252|248|240|224|192|128)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/);
				const ipv4BitmaskR = new RegExp(/^(([1-9])|(1[0-9])|(2[0-9])|(3[12]))$/);
				if (!ipv4NetmaskR.test(ip[1]) && !ipv4BitmaskR.test(ip[1])) {
					throw new SyntaxError('Invalid IPv4 address');
				}
			}
			this.version = 4;
			this.ipv4 = new IPv4(ipAddressString);
		} else if (ipv6AddressR.test(ip[0])) {
			if (ip.length > 1) {
				const ipv6BitmaskR = new RegExp(/^(([1-9])|(1[0-9])|(2[0-9])|(3[12]))$/);
				if (!ipv6BitmaskR.test(ip[1])) {
					throw new SyntaxError('Invalid IPv4 address');
				}
			}
			this.version = 6;
			this.ipv6 = new IPv6(ipAddressString);
		} else {
			throw new SyntaxError('Invalid IP Address');
		}

	}

	public getAddress(binary: boolean): string {
		if (this.version === 4) {
			return this.ipv4.getAddress(binary);
		} else {
			return this.ipv6.getAddress(binary);
		}
	}

	public getBroadcastAddress(binary: boolean): string {
		if (this.version === 4) {
			return this.ipv4.getBroadcastAddress(binary);
		} else {
			return this.ipv6.getBroadcastAddress(binary);
		}
	}

	public getCIDR(): number {
		if (this.version === 4) {
			return this.ipv4.getCIDR();
		} else {
			return this.ipv6.getCIDR();
		}
	}

	public getNetworkAddress(binary: boolean): string {
		if (this.version === 4) {
			return this.ipv4.getNetworkAddress(binary);
		} else {
			return this.ipv6.getNetworkAddress(binary);
		}
	}

	public getSubnetMask(binary: boolean): string {
		if (this.version === 4) {
			return this.ipv4.getSubnetMask(binary);
		} else {
			return this.ipv6.getSubnetMask(binary);
		}
	}

	public toString(binary: boolean = false) {
		if (this.version === 4) {
			return this.ipv4.toString(binary);
		} else {
			return this.ipv6.toString(binary);
		}
	}

}
