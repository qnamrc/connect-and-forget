import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { NotFoundComponent } from './not-found.component';
import { NotFoundRoutingModule } from './not-found-routing.module';

@NgModule({
	imports: [
		NotFoundRoutingModule,
		RouterModule,
		TranslateModule,
	],
	declarations: [
		NotFoundComponent
	]
})
export class NotFoundModule {}
