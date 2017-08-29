import { Component, OnInit } from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../services/auth.service';


@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(
		private auth: AuthService,
		private translate: TranslateService,
		public router: Router
	) {
		this.router.events.subscribe((val) => {
			if (val instanceof NavigationEnd && window.innerWidth <= 992) {
				this.toggleSidebar();
			}
		});
	}


	// ----------------------------------------------------------------------------------------------------
	// Component initializations
	// ----------------------------------------------------------------------------------------------------
	ngOnInit() {
	}


	// ----------------------------------------------------------------------------------------------------
	//
	// ----------------------------------------------------------------------------------------------------
	toggleSidebar() {
		const dom: any = document.querySelector('body');
		dom.classList.toggle('push-right');
	}


	// ----------------------------------------------------------------------------------------------------
	//
	// ----------------------------------------------------------------------------------------------------
	rltAndLtr() {
		const dom: any = document.querySelector('body');
		dom.classList.toggle('rtl');
	}


	// ----------------------------------------------------------------------------------------------------
	//
	// ----------------------------------------------------------------------------------------------------
	onLoggedout() {
		this.auth.logout();
	}


	// ----------------------------------------------------------------------------------------------------
	//
	// ----------------------------------------------------------------------------------------------------
	changeLang(language: string) {
		this.translate.use(language);
	}

}
