import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-localstorage';
import { MqttConnectionState, MqttService, MqttMessage, PublishOptions } from 'ngx-mqtt';
import { Observable } from 'rxjs/Rx';

import { Client as MqttClient, IClientOptions } from 'mqtt';
import { extend } from 'xtend';

import { ConfigurationService } from './configuration.service';


@Injectable()
export class MqService {
	private isConnected = false;
	private mqttConfig: Object;


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor(
		private configuration: ConfigurationService,
		private storage: LocalStorageService,
		private mqtt: MqttService
	) {

		// Register event handlers (to manage connection status)
		this.mqtt.onConnect.subscribe((e) => {
			this.isConnected = true;
		});
		this.mqtt.onReconnect.subscribe(() => {
			this.isConnected = true;
		});
		this.mqtt.onError.subscribe((e) => {
			this.isConnected = false;
		});
		this.mqtt.onClose.subscribe(() => {
			this.isConnected = false;
		});

		// Read configuration and connect to MQTT backend
		this.configuration.read('mqtt')
		.subscribe( (configurationData) => {

			// TODO: check mqttConfig parameters

			this.mqttConfig = configurationData;

			let mqttClientId = this.storage.get('clientId', 'mqtt');
			if (mqttClientId === null) {
				mqttClientId = 'alx-prova2';
				this.storage.set('clientId', mqttClientId, 'mqtt');
			}

			this.mqtt.connect({
				hostname: this.mqttConfig['host'],
				port: this.mqttConfig['port'],
				path: this.mqttConfig['path'],
				username: this.mqttConfig['username'],
				password: this.mqttConfig['password'],
				clientId: mqttClientId
			});

		});

	}


	// ----------------------------------------------------------------------------------------------------
	// Publish to topic
	// ----------------------------------------------------------------------------------------------------
	pub(topic: string, message: any, options?: PublishOptions) {

		if (this.isConnected) {

			// Already connected: simply publish the message after managing the topic prefix
			return this.mqtt
			.publish(this.mqttConfig['prefix'] + topic, message, options);

		} else {

			// Not connected: wrap subscription in a retry cicle
			return Observable.from([this.isConnected])
			.flatMap( (obs) => {

				// Publish the message after managing the topic prefix
				if (this.isConnected) {
					return this.mqtt
					.publish(this.mqttConfig['prefix'] + topic, message, options);
				}

				// Still not connected: throw exception to retry
				throw(new Error('Not connected'));

			})
			.retryWhen( (err) => {

				// Delay and retry
				return err.delay(1000);

			});

		}

	}


	// ----------------------------------------------------------------------------------------------------
	// Subscribe to topic
	// ----------------------------------------------------------------------------------------------------
	sub(topic: string) {

		if (this.isConnected) {

			// Already connected: simply return the subscription after managing the topic prefix
			return this.mqtt
			.observe(this.mqttConfig['prefix'] + topic)
			.map( (m: MqttMessage) => {
				m.topic = m.topic.replace(this.mqttConfig['prefix'], '');
				return m;
			});

		} else {

			// Not connected: wrap subscription in a retry cicle
			return Observable.from([this.isConnected])
			.flatMap( (obs) => {

				// Return the subscription after managing the topic prefix
				if (this.isConnected) {
					return this.mqtt
					.observe(this.mqttConfig['prefix'] + topic)
					.map( (m: MqttMessage) => {
						m.topic = m.topic.replace(this.mqttConfig['prefix'], '');
						return m;
					});
				}

				// Still not connected: throw exception to retry
				throw(new Error('Not connected'));

			})
			.retryWhen( (err) => {

				// Delay and retry
				return err.delay(1000);

			});

		}

	}

}
