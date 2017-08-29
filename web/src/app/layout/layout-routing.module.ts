import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
	{
		path: '', component: LayoutComponent,
		children: [
			{
				path: 'blank-page',
				loadChildren: './blank-page/blank-page.module#BlankPageModule'
			},
			{
				path: 'start-page',
				loadChildren: './start-page/start-page.module#StartPageModule'
			},
			{
				path: 'destination/:destinationGUID/system/:systemGUID',
				loadChildren: './destination/destination.module#DestinationModule'
			},
			{
				path: 'destination/:destinationGUID',
				loadChildren: './destination/destination.module#DestinationModule'
			},
			{
				path: 'test-page',
				loadChildren: './test-page/test-page.module#TestPageModule'
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LayoutRoutingModule { }
