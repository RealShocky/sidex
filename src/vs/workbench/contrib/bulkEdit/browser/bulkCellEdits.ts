/*---------------------------------------------------------------------------------------------
 *  SideX: Stub for removed bulk cell edits (notebook-related).
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';

export class ResourceNotebookCellEdit {
	static is(_edit: unknown): _edit is ResourceNotebookCellEdit { return false; }
	constructor(
		public resource: URI = URI.parse(''),
		public cellEdit: unknown = {},
		public versionId?: number,
		public metadata?: unknown,
	) {}
}
