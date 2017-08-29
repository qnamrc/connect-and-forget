import { Injectable } from '@angular/core';

import { LocalStorageService } from 'ngx-localstorage';
import { Response } from '@angular/http';
import { RestService } from './rest.service';

import { Observable, Subject } from 'rxjs/Rx';


@Injectable()
export class AuthService {


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(
		private storage: LocalStorageService,
		private rest: RestService
	) {
	}


	// ----------------------------------------------------------------------------------------------------
	// Check if user is authenticated
	// ----------------------------------------------------------------------------------------------------
	isAuthenticated(): boolean {
		const authData = JSON.parse(this.storage.get('data', 'auth')) as Object;

		if (authData === null) {
			return false;
		} else if (!authData.hasOwnProperty('token')) {
			return false;
		} else if (!authData.hasOwnProperty('expires') || (1000 * authData['expires']) < Date.now()) {
			return false;
		}

		// OK, we're authenticated
		return true;

	}


	// ----------------------------------------------------------------------------------------------------
	// Verify user authentication and get tokens
	// ----------------------------------------------------------------------------------------------------
	login(user: string, password: string): Observable<any> {
		// console.log('AuthService.login', user, password);

		// Verify and assemble credentials
		if (user === undefined || password === undefined) { return Observable.throw(new Error('Invalid credentials')); }
		const credentials = {
			user: user,
			password: password
		};

		const answer = new Subject<String>();

		// Call tokens REST API
		this.rest
		.post('/tokens', credentials)
		.subscribe(
			(goodAnswer: Response) => {
				// console.log('goodAnswer', goodAnswer);

				// Read and store authentication data
				this.storeAuthData(goodAnswer);

				answer.next('OK');

				// Set to refresh authentication data
				// this.refreshAuthData(authData);

			},
			(badAnswer: Response) => {
				// console.log('badAnswer', badAnswer);
				const errorMessage = JSON.parse(badAnswer.text());
				if (errorMessage.hasOwnProperty('errorCode')) {
					answer.error(errorMessage['errorCode']);
				} else {
					answer.error(errorMessage);
				}
			}
		);

		// Cleanup password
		credentials['password'] = password = undefined;

		return answer.asObservable();
	}


	// ----------------------------------------------------------------------------------------------------
	// Clear local auth data
	// ----------------------------------------------------------------------------------------------------
	logout() {
		this.storage.remove('data', 'auth');
	}


	// ----------------------------------------------------------------------------------------------------
	// Refresh authentication data
	// ----------------------------------------------------------------------------------------------------
	// private refreshAuthData(authData: Object): void {
	// 	if (!authData.hasOwnProperty('expires')) { return; }

	// 	// Set timer before token expires
	// 	const tokenExpiration = authData['expires'];
	// 	const delay = new Date((tokenExpiration - 60) * 1000);
	// 	Observable.timer(delay)
	// 	.subscribe ( () => {

	// 		// Request token renew
	// 		this.rest.put('/tokens', authData['token'])
	// 		.retryWhen( (error) => error.delay(10000) )
	// 		.subscribe( (response) => {

	// 			// Store new authentication data
	// 			const newAuthData = this.storeAuthData(response);

	// 			// Set to refresh authentication data
	// 			this.refreshAuthData(newAuthData);

	// 		});
	// 	});

	// }


	// ----------------------------------------------------------------------------------------------------
	// Store authentication data
	// ----------------------------------------------------------------------------------------------------
	private storeAuthData(response): void {
		const authData = response.json() as Object;
		this.storage.set('data', JSON.stringify(authData), 'auth');
	}

}
