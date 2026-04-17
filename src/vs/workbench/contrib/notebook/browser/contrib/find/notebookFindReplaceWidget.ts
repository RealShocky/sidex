/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../../base/common/lifecycle.js';
import type { NotebookFindFilters } from './findFilters.js';

export class NotebookFindInputFilterButton extends Disposable {
	readonly container: HTMLElement;

	constructor(
		_filters: NotebookFindFilters,
		_contextMenuService: any,
		_instantiationService: any,
		_options: any,
		_label?: string,
	) {
		super();
		this.container = document.createElement('div');
	}

	get width(): number {
		return 0;
	}
}
