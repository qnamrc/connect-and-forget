import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { IDestination, Destination } from '../../classes/destination';
import { DestinationsService } from '../../services/destinations.service';

import { UUID } from '../../classes/uuid';

import _ from 'lodash';


@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnDestroy {
	destinations: IDestination[];
	favoriteDestinations: IDestination[];
	searchResult: IDestination[];
	showSearchResults = false;
	searchString = '';
	isActive = false;
	menuItemExpanded = 'other';
	p = 1;
	streamSubscriptions: Subscription[] = [];


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor (
		private destinationsService: DestinationsService
	) {
		// console.log('SidebarComponent: constructor');

		// Subscribe to destinations stream
		this.streamSubscriptions.push(
			this.destinationsService.getDestinationsListStream()
			.subscribe( (destinations: IDestination[]) => {
				this.destinations = this.searchResult = destinations;
				this.favoriteDestinations = _.filter(destinations, ['isFavorite', true]);
			})
		);

		// Read list of destinations
		this.destinationsService.readList();

	}


	// ----------------------------------------------------------------------------------------------------
	// Final operations
	// ----------------------------------------------------------------------------------------------------
	ngOnDestroy() {

		// Unsubscribe from all streams
		this.streamSubscriptions.forEach( (subscription: Subscription) => {
			subscription.unsubscribe();
		});

	}


	// ----------------------------------------------------------------------------------------------------
	// Clear search box
	// ----------------------------------------------------------------------------------------------------
	clearSearchBox(sb: HTMLInputElement) {
		this.searchString = sb.value = '';
		this.searchResult = this.destinations;
		this.showSearchResults = false;
		sb.focus();
	}


	// ----------------------------------------------------------------------------------------------------
	// Perform search
	// ----------------------------------------------------------------------------------------------------
	doSearch(sb: HTMLInputElement) {
		function regexEscape(re: string) {
			return re.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		}

		this.showSearchResults = (sb.value !== '');
		if (this.showSearchResults) {
			const regExp = new RegExp('.*' + regexEscape(sb.value) + '.*', 'i');

			this.searchResult = _.filter(this.destinations, (destination: IDestination) => {
				// console.log(destination.name, destination.description, regExp.exec(destination.name + destination.description));
				return (regExp.exec(destination.name + destination.description) != null);
			});
		} else {
			this.clearSearchBox(sb);
			this.searchString = '';
			this.searchResult = this.destinations;
		}
	}


	// ----------------------------------------------------------------------------------------------------
	// Set expanded menu
	// ----------------------------------------------------------------------------------------------------
	toggleMenu(itemToExpand: string) {
		this.menuItemExpanded = itemToExpand;
	}

}
