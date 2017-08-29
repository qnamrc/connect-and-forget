import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './shared';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MqttModule, MqttService } from 'ngx-mqtt';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AuthService } from './shared/services/auth.service';
import { ConfigurationService } from './shared/services/configuration.service';
import { ConnectionsService } from './shared/services/connections.service';
import { DataCacheService } from './shared/services/data-cache.service';
import { DataService } from './shared/services/data.service';
import { DestinationsService } from './shared/services/destinations.service';
import { LinksService } from './shared/services/links.service';
import { MqService } from './shared/services/mq.service';
import { RestService } from './shared/services/rest.service';
import { SystemsService } from './shared/services/systems.service';


export const MQTT_SERVICE_OPTIONS = {
	connectOnCreate: false
};


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}
export function mqttServiceFactory() {
	return new MqttService(MQTT_SERVICE_OPTIONS);
}


@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		AppRoutingModule,
		BrowserAnimationsModule,
		BrowserModule,
		FormsModule,
		HttpClientModule,
		HttpModule,
		NgxLocalStorageModule.forRoot(),
		MqttModule.forRoot({
			provide: MqttService,
			useFactory: mqttServiceFactory
		}),
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
	],
	providers: [
		AuthGuard,
		AuthService,
		ConfigurationService,
		ConnectionsService,
		DataCacheService,
		DataService,
		DestinationsService,
		LinksService,
		MqService,
		RestService,
		SystemsService
	],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor() {
		const de = document.documentElement;
		// console.log('global.height', de.nodeName, de.id, de.clientHeight, de.offsetHeight, de.scrollHeight);
		// console.log('global.top', de.nodeName, de.id, de.clientTop, de.offsetTop, de.scrollTop);
		// const db = document.body;
		// console.log('global.height', db.nodeName, db.id, db.clientHeight, db.offsetHeight, db.scrollHeight);
		// console.log('global.top', db.nodeName, db.id, db.clientTop, db.offsetTop, db.scrollTop);

		// de.style.setProperty('height', '-webkit-fill-available');
		// db.style.setProperty('height', '-webkit-fill-available');
		// de.style.setProperty('height', de.clientHeight.toString() + 'px');
		// de.style.setProperty('overflow', 'hidden');
		// db.style.setProperty('height', de.clientHeight.toString() + 'px');
		// db.style.setProperty('overflow', 'hidden');
	}
}
