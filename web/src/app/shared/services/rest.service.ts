import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, RequestOptions, Response, Headers } from '@angular/http';
import { LocalStorageService } from 'ngx-localstorage';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';


// import { environment } from 'environments/environment';
// const API_URL = environment.apiUrl;
const API_URL = '/api/v1';


@Injectable()
export class RestService {


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(
		private http: Http,
		private router: Router,
		private storage: LocalStorageService
	) {
	}


	// ----------------------------------------------------------------------------------------------------
	// Add authentication token
	// ----------------------------------------------------------------------------------------------------
	private addAuthentication(options: RequestOptionsArgs) {
		if (options === undefined) { options = {} as RequestOptions; }
		if (options.headers === undefined) { options.headers = new Headers(); }

		const authData = JSON.parse(this.storage.get('data', 'auth')) as Object;
		if (authData !== null && authData.hasOwnProperty('token')) { options.headers.append('Authorization', 'Bearer ' + authData['token']); }
		options.headers.append('Content-Type', 'application/json');
		return options;
	}


	// ----------------------------------------------------------------------------------------------------
	// Intercept HTTP errors
	// ----------------------------------------------------------------------------------------------------
	catchHttpErrors(observable: Observable<Response>): Observable<Response> {
		return observable.catch((error, source) => {
			// console.log('catchHttpErrors', error, source);
			if (error.status === 401) {
				this.router.navigate(['/login']);
				return Observable.empty();
			} else {
				return Observable.throw(error);
			}
		});
	}


	// ----------------------------------------------------------------------------------------------------
	// Verify and fix URI
	// ----------------------------------------------------------------------------------------------------
	private checkURI(uri: string): string {
		if (uri.substr(0, 1) !== '/') { uri = '/' + uri; }
		return API_URL + uri;
	}


	// ----------------------------------------------------------------------------------------------------
	// DELETE method (Delete)
	// ----------------------------------------------------------------------------------------------------
	delete(uri: string, options?: RequestOptionsArgs): Observable<Response> {
		return this.http.delete(this.checkURI(uri), this.addAuthentication(options));
	}


	// ----------------------------------------------------------------------------------------------------
	// GET method (Read)
	// ----------------------------------------------------------------------------------------------------
	get(uri: string, options?: RequestOptionsArgs): Observable<Object> {
		return this.catchHttpErrors(
			this.http.get(this.checkURI(uri), this.addAuthentication(options))
			.map( (response) => response.json() )
		);
	}


	// ----------------------------------------------------------------------------------------------------
	// PATCH method (Update: modify)
	// ----------------------------------------------------------------------------------------------------
	patch(uri: string, updateData: Object, options?: RequestOptionsArgs): Observable<Response> {
		return this.catchHttpErrors(
			this.http
			.patch(this.checkURI(uri), updateData, this.addAuthentication(options))
		);
	}


	// ----------------------------------------------------------------------------------------------------
	// POST method (Create)
	// ----------------------------------------------------------------------------------------------------
	post(uri: string, updateData: Object, options?: RequestOptionsArgs): Observable<Response> {
		if (uri === '/tokens') {
			return this.catchHttpErrors(
				this.http
				.post(this.checkURI(uri), updateData)
			);
		} else {
			return this.catchHttpErrors(
				this.http
				.post(this.checkURI(uri), updateData, this.addAuthentication(options))
			);
		}
	}


	// ----------------------------------------------------------------------------------------------------
	// PUT method (Update: replace)
	// ----------------------------------------------------------------------------------------------------
	put(uri: string, updateData: Object, options?: RequestOptionsArgs): Observable<Response> {
		return this.catchHttpErrors(
			this.http
			.put(this.checkURI(uri), updateData, this.addAuthentication(options))
		);
	}

}
