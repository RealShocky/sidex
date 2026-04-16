/*---------------------------------------------------------------------------------------------
 *  Stub: SCM History Chat Context
 *  Provides the SCMHistoryItemTransferData type used for drag-and-drop
 *  of SCM history items. The full chat integration module is not present
 *  in this build.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { ISCMHistoryItem } from '../common/history.js';

export interface SCMHistoryItemTransferData {
	readonly name: string;
	readonly resource: URI;
	readonly historyItem: ISCMHistoryItem;
}
