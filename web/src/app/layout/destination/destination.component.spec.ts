import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationComponent } from './destination.component';

describe('DestinationComponent', () => {
	let component: DestinationComponent;
	let fixture: ComponentFixture<DestinationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ DestinationComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DestinationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
