/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Widget } from '../../../../../base/browser/ui/widget.js';
import { Event, Emitter } from '../../../../../base/common/event.js';
import { IDisposable } from '../../../../../base/common/lifecycle.js';

export interface ISuggestResultsProvider {
	/**
	 * Provider function for suggestion results.
	 */
	provideResults(value: string): string[];
}

export const SuggestResultsProvider = Symbol('SuggestResultsProvider');

export class SuggestEnabledInput extends Widget {
	private readonly _onShouldFocusResults = this._register(new Emitter<void>());
	readonly onShouldFocusResults: Event<void> = this._onShouldFocusResults.event;

	private readonly _onInputDidChange = this._register(new Emitter<string | undefined>());
	readonly onInputDidChange: Event<string | undefined> = this._onInputDidChange.event;

	private readonly _onDidFocus = this._register(new Emitter<void>());
	readonly onDidFocus: Event<void> = this._onDidFocus.event;

	private readonly _onDidBlur = this._register(new Emitter<void>());
	readonly onDidBlur: Event<void> = this._onDidBlur.event;

	private _value = '';

	constructor(..._args: any[]) {
		super();
	}

	getValue(): string {
		return this._value;
	}

	setValue(val: string): void {
		this._value = val;
	}

	focus(): void { }

	layout(_dimension?: any): void { }

	getDomNode(): HTMLElement {
		return document.createElement('div');
	}

	get onFocus(): Event<void> {
		return this._onDidFocus.event;
	}
}

export class SuggestEnabledInputWithHistory extends SuggestEnabledInput {
	constructor(..._args: any[]) {
		super();
	}

	showNextValue(): void { }
	showPreviousValue(): void { }
}

export class ContextScopedSuggestEnabledInputWithHistory extends SuggestEnabledInputWithHistory {
	constructor(..._args: any[]) {
		super();
	}
}
