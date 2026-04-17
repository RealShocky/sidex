/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Action } from '../../../../base/common/actions.js';

export class OpenScmGroupAction extends Action {
	static readonly ID = 'workbench.scm.action.openScmGroup';

	constructor(..._args: any[]) {
		super(OpenScmGroupAction.ID, 'Open Changes');
	}

	override async run(): Promise<void> { }
}

export class ScmHistoryItemResolver {
	constructor(..._args: any[]) { }

	async resolveHistoryItemGroupBase(_historyItemGroup: any): Promise<any> {
		return undefined;
	}

	async resolveHistoryItemGroupCommonAncestor(_historyItemGroup1: any, _historyItemGroup2: any): Promise<any> {
		return undefined;
	}
}
