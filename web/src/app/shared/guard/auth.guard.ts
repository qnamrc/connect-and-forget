import { Injectable } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


@Injectable()
export class AuthGuard implements CanActivate {


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(
		private auth: AuthService,
		private router: Router,
	) {
	}


	// ----------------------------------------------------------------------------------------------------
	// Check if we need to authenticate
	// ----------------------------------------------------------------------------------------------------
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

		if (this.auth.isAuthenticated()) { return true; }

		if (state.url === '/') {
			this.router.navigate(['/login']);
		} else {
			this.router.navigate(['/login'], {queryParams: {next: state.url}});
		}
		return false;
	}

}
