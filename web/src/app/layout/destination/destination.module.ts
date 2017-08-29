import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ConnectionsComponent } from './connections/connections.component';
import { DestinationRoutingModule } from './destination-routing.module';
import { DestinationComponent } from './destination.component';
import { SystemsComponent } from './systems/systems.component';
import { SystemComponent } from './system/system.component';

import { TextEditorComponent } from '../../shared/components/text-editor/text-editor.component';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';


@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
		NgbDropdownModule,
		DestinationRoutingModule,
		FormsModule,
		QuillModule,
	],
	declarations: [
		ConnectionsComponent,
		DestinationComponent,
		SystemComponent,
		SystemsComponent,
		TextEditorComponent,
	]
})
export class DestinationModule { }
