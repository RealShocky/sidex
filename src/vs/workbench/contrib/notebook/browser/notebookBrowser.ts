/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface ICellViewModel {
	readonly id: string;
	handle: number;
	uri: any;
	cellKind: any;
	language: string;
	getText(): string;
}

export interface CellFindMatchWithIndex {
	cell: ICellViewModel;
	index: number;
	length: number;
	contentMatches: any[];
	webviewMatches: CellWebviewFindMatch[];
}

export interface CellWebviewFindMatch {
	readonly index: number;
}

export interface INotebookEditorCreationOptions {
	readonly isSimpleWidget?: boolean;
}

export const EXPAND_CELL_INPUT_COMMAND_ID = 'notebook.cell.expandCellInput';
export const EXPAND_CELL_OUTPUT_COMMAND_ID = 'notebook.cell.expandCellOutput';
