import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';


@Component({
	selector: 'app-text-editor',
	templateUrl: './text-editor.component.html',
	styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent {
	@Input() caption: string;
	@Input() type: string;
	@Input() text: string;
	@Input() placeholderView: string;
	@Input() placeholderEdit: string;
	@Output() textChanged = new EventEmitter<String>();
	editing = false;
	modules = {
		toolbar: [
			['bold', 'italic', 'underline'],
			['blockquote', 'code-block'],
			[{ 'list': 'ordered'}, { 'list': 'bullet' }],
			[{ 'indent': '-1'}, { 'indent': '+1' }],
			// [{ 'size': ['small', false, 'large'] }],
			[{ 'color': [] }, { 'background': [] }],
			[{ 'font': [] }],
			[{ 'align': [] }],
			['link']
		]
	};
	private oldText: string;


	// ----------------------------------------------------------------------------------------------------
	// Constructor
	// ----------------------------------------------------------------------------------------------------
	constructor() {}


	// ----------------------------------------------------------------------------------------------------
	// Comments box management
	// ----------------------------------------------------------------------------------------------------
	startEditing() {
		this.oldText = this.text;
		this.editing = true;
	}
	cancelEditing() {
		this.text = this.oldText;
		this.editing = false;
	}
	saveChanges() {
		this.textChanged.emit(this.text);
		this.editing = false;
	}

}
