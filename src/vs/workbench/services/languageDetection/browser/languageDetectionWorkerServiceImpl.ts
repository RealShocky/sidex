/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILanguageDetectionService } from '../common/languageDetectionWorkerService.js';
import { URI } from '../../../../base/common/uri.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';

// Stub: language detection is now handled by sidex-syntax Rust crate
export class LanguageDetectionService implements ILanguageDetectionService {
	_serviceBrand: undefined;

	isEnabledForLanguage(_languageId: string): boolean {
		return false;
	}

	async detectLanguage(_resource: URI, _supportedLangs?: string[]): Promise<string | undefined> {
		return undefined;
	}
}

registerSingleton(ILanguageDetectionService, LanguageDetectionService, InstantiationType.Eager);
