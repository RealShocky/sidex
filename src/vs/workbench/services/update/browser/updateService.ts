/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event, Emitter } from '../../../../base/common/event.js';
import { IUpdateService, State, UpdateType } from '../../../../platform/update/common/update.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';

export interface IUpdate {
	version: string;
}

export interface IUpdateProvider {
	checkForUpdate(): Promise<IUpdate | null>;
}

// Stub: update service is now handled by Tauri updater
export class BrowserUpdateService implements IUpdateService {
	declare readonly _serviceBrand: undefined;

	private _onStateChange = new Emitter<State>();
	readonly onStateChange: Event<State> = this._onStateChange.event;

	private _state: State = State.Idle(UpdateType.Archive);
	get state(): State { return this._state; }

	async isLatestVersion(): Promise<boolean | undefined> { return true; }
	async checkForUpdates(_explicit: boolean): Promise<void> {}
	async downloadUpdate(_explicit: boolean): Promise<void> {}
	async applyUpdate(): Promise<void> {}
	async quitAndInstall(): Promise<void> {}
	async _applySpecificUpdate(_packagePath: string): Promise<void> {}
	async setInternalOrg(_internalOrg: string | undefined): Promise<void> {}
}

registerSingleton(IUpdateService, BrowserUpdateService, InstantiationType.Eager);
