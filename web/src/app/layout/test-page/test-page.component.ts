import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';
import { RestService } from '../../shared/services/rest.service';

import { IDestination, Destination } from '../../shared/classes/destination';
import { ILink, Link } from '../../shared/classes/link';

export enum LinkStatus {
	'Terminated',
	'Connecting',
	'Established',
	'Disconnecting',
	'Failed',
	'Recovering'
}


@Component({
	selector: 'app-test-page',
	templateUrl: './test-page.component.html',
	styleUrls: ['./test-page.component.scss']
})
export class TestPageComponent implements OnInit {
	contentHeight: number;
	offsetHeight: number;
	clientHeight: number;


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(
		private rest: RestService
	) {
	}


	private setContentHeigth() {
		// const de = document.documentElement;
		// this.contentHeight = this.clientHeight - this.offsetHeight;
		// // const header = document.getElementById('header');
		// const titleBar = document.getElementById('titleBar');
		// console.log('contentHeight', this.contentHeight);
		// console.log('de', de.offsetHeight, de.scrollHeight, de.clientHeight, de.offsetTop, de.scrollTop, de.clientTop);
	}

	test2() {
		console.log('');

		let sc = '' + this.clientHeight + ' - ' + this.offsetHeight;
		let s = this.clientHeight - this.offsetHeight;
		// let s = 0;
		let elem = document.getElementById('systems');
		while (elem.id !== 'contentBox') {
			if (elem.clientHeight > 0) {
				// console.log('height', elem.nodeName, elem.id, elem.clientHeight, elem.offsetHeight, elem.scrollHeight);
				console.log('top', elem.nodeName, elem.id, elem.clientTop, elem.offsetTop, elem.scrollTop);
				s -= elem.offsetTop;
				sc += ' - ' + elem.offsetTop;
			}
			elem = elem.parentElement;
		}
		if (elem.clientHeight > 0) {
			// console.log('height', elem.nodeName, elem.id, elem.clientHeight, elem.offsetHeight, elem.scrollHeight);
			console.log('top', elem.nodeName, elem.id, elem.clientTop, elem.offsetTop, elem.scrollTop);
		}

		const de = document.documentElement;
		console.log('global.height', de.nodeName, de.id, de.clientHeight, de.offsetHeight, de.scrollHeight);
		console.log('global.top', de.nodeName, de.id, de.clientTop, de.offsetTop, de.scrollTop);

		console.log('sc:', s, '=', sc);

		// this.contentHeight = this.clientHeight - this.offsetHeight - 121;
		// this.contentHeight = this.clientHeight - this.offsetHeight - 172;
		this.contentHeight = s + 15;
		console.log('contentHeight', this.contentHeight);

		elem = document.getElementById('systems');
		console.log('width', elem.nodeName, elem.id, elem.clientWidth, elem.offsetWidth, elem.scrollWidth);
		// console.log('x', elem);
		// console.log('x', elem.style.margin, elem.style.border, elem.style.padding);

		// 860

		// this.setContentHeigth();
		// const body = document.body;
		// const header = document.getElementById('header');
		// const elem = document.getElementById('elem');
		// const titleBar = document.getElementById('titleBar');
		// const contentBox = document.getElementById('contentBox');
		// const de = document.documentElement;

		// console.log('body', body.offsetHeight, body.offsetTop, body.clientHeight, body.clientTop);
		// console.log('header', header.offsetHeight, header.offsetTop, header.clientHeight, header.clientTop, header.scrollHeight, header.scrollTop);
		// console.log('alle', elem.offsetHeight, elem.scrollHeight, elem.clientHeight, elem.clientTop);
		// console.log('titleBar', titleBar.offsetHeight, titleBar.offsetTop, titleBar.clientHeight, titleBar.clientTop, titleBar.scrollHeight, titleBar.scrollTop);
		// console.log('contentBox', contentBox.offsetHeight, contentBox.scrollHeight, contentBox.clientHeight, contentBox.clientTop);
		// console.log('de', de.offsetHeight, de.scrollHeight, de.clientHeight, de.offsetTop, de.scrollTop, de.clientTop);
		// console.log('offsetHeight/clientHeigth', this.offsetHeight, this.clientHeight);
		// this.contentHeight = this.clientHeight - this.offsetHeight - titleBar.offsetHeight - header.offsetHeight;


	}

	// ----------------------------------------------------------------------------------------------------
	// Component initializations
	// ----------------------------------------------------------------------------------------------------
	ngOnInit() {
		// console.log('TestPageComponent.ngOnInit');

		Observable.timer(1000).subscribe( (t: number) => {
			// this.test2();
		});
	}


	test() {
		const json = JSON.parse('{"linkguid":"df5b709a-3a67-4795-82a4-e0f45cc4edc4","destinationguid":"df5b709a-3a67-4795-82a4-e0f45cc4edc4","status":"Established","connection":"{\"connectionGUID\" : \"7821f78c-0c0c-47e9-99ae-a69ca294e361\", \"destinationGUID\" : \"df5b709a-3a67-4795-82a4-e0f45cc4edc4\", \"name\" : \"ALESSANDRIA\", \"description\" : null, \"comments\" : null, \"type\" : \"Shared\", \"subnet\" : \"10.251.30.0\/25\", \"enableInstructions\" : null}"}') as Object;
		console.log(json);

		const newObj = new Link(json);

		// Verify mandatory fields have been supplied
		// let errorMessage = '';
		// for (const field in fields) {
		// 	if (true) {
		// 		const fieldLower = field.toLowerCase();
		// 		const isMandatory = fields[field];
		// 		// console.log(field, fieldLower, fields[field], json.hasOwnProperty(field), json.hasOwnProperty(fieldLower));
		// 		if (!json.hasOwnProperty(field) && !json.hasOwnProperty(fieldLower)) {
		// 			if (isMandatory) { errorMessage += ( (errorMessage === '' ) ? 'Missing fields: ' : ', ') + field; }
		// 		} else {
		// 			if (json.hasOwnProperty(field)) {
		// 				newObj[field] = json[field];
		// 			} else {
		// 				newObj[field] = json[fieldLower];
		// 			}
		// 		}
		// 	}
		// }
		// console.log(errorMessage);
		console.log(newObj);

		// if (mandatoryMembers !== undefined) {
		// 	let errorMessage = '';
		// 	for (const i in mandatoryMembers) {
		// 		// for (let i = 0; i < mandatoryMembers.length; i++) {
		// 		if (!json.hasOwnProperty(mandatoryMembers[i]) && json.hasOwnProperty(mandatoryMembers[i].toLowerCase())) {
		// 			errorMessage += ( (errorMessage === '' ) ? 'Missing fields: ' : ', ') + mandatoryMembers[i];
		// 		}
		// 	}
		// 	if (errorMessage !== '') { throw new TypeError(errorMessage); }
		// }

		// // Load base properties from JSON object
		// for (const key in json) {
		// 	if (json.hasOwnProperty(key)) {
		// 		this[key] = json[key];
		// 	}
		// }

	}

	// let status1 = Number(LinkStatus['Terminated']);
	// console.log(status1);
	// status1 = Number(LinkStatus['TerminaXted']);
	// console.log(status1);
	// if (status in LinkStatus) {
	// 	this.status = status;
	// } else {
	// 	throw SyntaxError(status + ' is not a valid LinkStatus');
	// }
}

