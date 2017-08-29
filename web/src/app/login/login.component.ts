import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { RestService } from '../shared/services/rest.service';

import { AuthService } from '../shared/services/auth.service';
import { routerTransition } from '../router.animations';


@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
	errorMessage: string;


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(
		private activatedRoute: ActivatedRoute,
		private auth: AuthService,
		private router: Router,
	) {
	}


	// ----------------------------------------------------------------------------------------------------
	// Component initializations
	// ----------------------------------------------------------------------------------------------------
	ngOnInit() {
	}


	// ----------------------------------------------------------------------------------------------------
	// Manage user login
	// ----------------------------------------------------------------------------------------------------
	login(user: string, password: string, event: UIEvent) {
		event.preventDefault();

		// Try to authenticate user
		this.auth.login(user, password)
		.subscribe(
			( success ) => {

				this.activatedRoute.queryParams
				.subscribe ( (queryParams: Object) => {
					if (queryParams.hasOwnProperty('next')) {

						// If we came here after being redirected, go to the original URL
						this.router.navigateByUrl(queryParams['next']);

					} else {

						// Otherwise, main page
						this.router.navigate(['/']);

					}
				});
			},
			( failure ) => {
				this.errorMessage = failure;
			}
		);

		// Cleanup password
		password = undefined;
	}

}
