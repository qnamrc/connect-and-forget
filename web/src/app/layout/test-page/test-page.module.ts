import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestPageRoutingModule } from './test-page-routing.module';
import { TestPageComponent } from './test-page.component';

@NgModule({
  imports: [
    CommonModule,
		TestPageRoutingModule,
  ],
  declarations: [
		TestPageComponent,
	]
})
export class TestPageModule { }
