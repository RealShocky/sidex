/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI, UriComponents } from '../../../base/common/uri.js';
import {
	MainContext,
	IMainContext,
	ExtHostFileSystemShape,
	MainThreadFileSystemShape,
	IFileChangeDto
} from './extHost.protocol.js';
import type * as vscode from 'vscode';
import * as files from '../../../platform/files/common/files.js';
import { IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { FileChangeType } from './extHostTypes.js';
import { ExtHostLanguageFeatures } from './extHostLanguageFeatures.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { checkProposedApiEnabled } from '../../services/extensions/common/extensions.js';
import { IMarkdownString, isMarkdownString } from '../../../base/common/htmlContent.js';

export class ExtHostFileSystem implements ExtHostFileSystemShape {
	private readonly _proxy: MainThreadFileSystemShape;
	private readonly _fsProvider = new Map<number, vscode.FileSystemProvider>();
	private readonly _registeredSchemes = new Set<string>();
	private readonly _watches = new Map<number, IDisposable>();
	private _handlePool: number = 0;

	constructor(
		mainContext: IMainContext,
		private _extHostLanguageFeatures: ExtHostLanguageFeatures
	) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadFileSystem);
	}

	dispose(): void { }

	registerFileSystemProvider(
		extension: IExtensionDescription,
		scheme: string,
		provider: vscode.FileSystemProvider,
		options: { isCaseSensitive?: boolean; isReadonly?: boolean | vscode.MarkdownString } = {}
	) {
		if (this._registeredSchemes.has(scheme)) {
			throw new Error(`a provider for the scheme '${scheme}' is already registered`);
		}

		const handle = this._handlePool++;
		this._registeredSchemes.add(scheme);
		this._fsProvider.set(handle, provider);

		let capabilities = files.FileSystemProviderCapabilities.FileReadWrite;
		if (options.isCaseSensitive) { capabilities += files.FileSystemProviderCapabilities.PathCaseSensitive; }
		if (options.isReadonly) { capabilities += files.FileSystemProviderCapabilities.Readonly; }
		if (typeof provider.copy === 'function') { capabilities += files.FileSystemProviderCapabilities.FileFolderCopy; }
		if (typeof provider.open === 'function' && typeof provider.close === 'function' &&
			typeof provider.read === 'function' && typeof provider.write === 'function') {
			checkProposedApiEnabled(extension, 'fsChunks');
			capabilities += files.FileSystemProviderCapabilities.FileOpenReadWriteClose;
		}

		let readOnlyMessage: IMarkdownString | undefined;
		if (options.isReadonly && isMarkdownString(options.isReadonly) && options.isReadonly.value !== '') {
			readOnlyMessage = {
				value: options.isReadonly.value,
				isTrusted: options.isReadonly.isTrusted,
				supportThemeIcons: options.isReadonly.supportThemeIcons,
				supportHtml: options.isReadonly.supportHtml,
				baseUri: options.isReadonly.baseUri,
				uris: options.isReadonly.uris
			};
		}

		this._proxy.$registerFileSystemProvider(handle, scheme, capabilities, readOnlyMessage).catch(err => {
			console.error(`FAILED to register filesystem provider of ${extension.identifier.value}-extension for the scheme ${scheme}`);
			console.error(err);
		});

		const subscription = provider.onDidChangeFile(event => {
			const mapped: IFileChangeDto[] = [];
			for (const e of event) {
				if (e.uri.scheme !== scheme) { continue; }
				let newType: files.FileChangeType | undefined;
				switch (e.type) {
					case FileChangeType.Changed: newType = files.FileChangeType.UPDATED; break;
					case FileChangeType.Created: newType = files.FileChangeType.ADDED; break;
					case FileChangeType.Deleted: newType = files.FileChangeType.DELETED; break;
					default: throw new Error('Unknown FileChangeType');
				}
				mapped.push({ resource: e.uri, type: newType });
			}
			this._proxy.$onFileSystemChange(handle, mapped);
		});

		return toDisposable(() => {
			subscription.dispose();
			this._registeredSchemes.delete(scheme);
			this._fsProvider.delete(handle);
			this._proxy.$unregisterProvider(handle);
		});
	}

	$stat(handle: number, resource: UriComponents): Promise<files.IStat> {
		return Promise.resolve(this._getFsProvider(handle).stat(URI.revive(resource)));
	}
	$readdir(handle: number, resource: UriComponents): Promise<[string, files.FileType][]> {
		return Promise.resolve(this._getFsProvider(handle).readDirectory(URI.revive(resource)));
	}
	$readFile(handle: number, resource: UriComponents): Promise<VSBuffer> {
		return Promise.resolve(this._getFsProvider(handle).readFile(URI.revive(resource))).then(data => VSBuffer.wrap(data));
	}
	$writeFile(handle: number, resource: UriComponents, content: VSBuffer, opts: files.IFileWriteOptions): Promise<void> {
		return Promise.resolve(this._getFsProvider(handle).writeFile(URI.revive(resource), content.buffer, opts));
	}
	$delete(handle: number, resource: UriComponents, opts: files.IFileDeleteOptions): Promise<void> {
		return Promise.resolve(this._getFsProvider(handle).delete(URI.revive(resource), opts));
	}
	$rename(handle: number, oldUri: UriComponents, newUri: UriComponents, opts: files.IFileOverwriteOptions): Promise<void> {
		return Promise.resolve(this._getFsProvider(handle).rename(URI.revive(oldUri), URI.revive(newUri), opts));
	}
	$copy(handle: number, oldUri: UriComponents, newUri: UriComponents, opts: files.IFileOverwriteOptions): Promise<void> {
		const provider = this._getFsProvider(handle);
		if (!provider.copy) { throw new Error('FileSystemProvider does not implement "copy"'); }
		return Promise.resolve(provider.copy(URI.revive(oldUri), URI.revive(newUri), opts));
	}
	$mkdir(handle: number, resource: UriComponents): Promise<void> {
		return Promise.resolve(this._getFsProvider(handle).createDirectory(URI.revive(resource)));
	}
	$watch(handle: number, session: number, resource: UriComponents, opts: files.IWatchOptions): void {
		this._watches.set(session, this._getFsProvider(handle).watch(URI.revive(resource), opts));
	}
	$unwatch(_handle: number, session: number): void {
		this._watches.get(session)?.dispose();
		this._watches.delete(session);
	}
	$open(handle: number, resource: UriComponents, opts: files.IFileOpenOptions): Promise<number> {
		const provider = this._getFsProvider(handle);
		if (!provider.open) { throw new Error('FileSystemProvider does not implement "open"'); }
		return Promise.resolve(provider.open(URI.revive(resource), opts));
	}
	$close(handle: number, fd: number): Promise<void> {
		const provider = this._getFsProvider(handle);
		if (!provider.close) { throw new Error('FileSystemProvider does not implement "close"'); }
		return Promise.resolve(provider.close(fd));
	}
	$read(handle: number, fd: number, pos: number, length: number): Promise<VSBuffer> {
		const provider = this._getFsProvider(handle);
		if (!provider.read) { throw new Error('FileSystemProvider does not implement "read"'); }
		const data = VSBuffer.alloc(length);
		return Promise.resolve(provider.read(fd, pos, data.buffer, 0, length)).then(read => data.slice(0, read));
	}
	$write(handle: number, fd: number, pos: number, data: VSBuffer): Promise<number> {
		const provider = this._getFsProvider(handle);
		if (!provider.write) { throw new Error('FileSystemProvider does not implement "write"'); }
		return Promise.resolve(provider.write(fd, pos, data.buffer, 0, data.byteLength));
	}

	private _getFsProvider(handle: number): vscode.FileSystemProvider {
		const provider = this._fsProvider.get(handle);
		if (!provider) {
			const err = new Error();
			err.name = 'ENOPRO';
			err.message = `no provider`;
			throw err;
		}
		return provider;
	}
}
