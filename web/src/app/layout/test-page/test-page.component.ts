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
		const updateData = {
			'connectionGUID': 'd4ca1a9d-a846-446a-9325-d933a80bef4f'
		};

		this.rest.post('/links', updateData)
		.subscribe(
			(data: Object) => {}
		);

	}

}

