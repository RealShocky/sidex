/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Action2 } from '../../../../platform/actions/common/actions.js';

export class AccessibilityHelpAction extends Action2 {
	constructor() {
		super({
			id: 'editor.action.accessibilityHelp',
			title: 'Accessibility Help',
			f1: true,
		});
	}
	run(): void { }
}

export class AccessibleViewAction extends Action2 {
	constructor() {
		super({
			id: 'editor.action.accessibleView',
			title: 'Accessible View',
			f1: true,
		});
	}
	run(): void { }
}
