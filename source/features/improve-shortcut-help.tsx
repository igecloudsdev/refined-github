import React from 'dom-chef';
import {elementExists} from 'select-dom';
import {$, $optional} from 'select-dom/strict.js';

import onetime from '../helpers/onetime.js';
import features from '../feature-manager.js';
import {isEditable} from '../helpers/dom-utils.js';
import {shortcutMap} from '../helpers/feature-helpers.js';

function splitKeys(keys: string): DocumentFragment[] {
	return keys.split(' ').map(key => <> <kbd>{key}</kbd></>);
}

function improveShortcutHelp(dialog: Element): void {
	$('.Box-body .col-5 .Box:first-child', dialog).after(
		<div className="Box Box--condensed m-4">
			<div className="Box-header">
				<h2 className="Box-title">Refined GitHub</h2>
			</div>

			<ul>
				{[...shortcutMap]
					.sort(([, a], [, b]) => a.localeCompare(b))
					.map(([hotkey, description]) => (
						<li className="Box-row d-flex flex-row">
							<div className="flex-auto">{description}</div>
							<div className="ml-2 no-wrap">
								{splitKeys(hotkey)}
							</div>
						</li>
					))}
			</ul>
		</div>,
	);
}

const observer = new MutationObserver(([{target}]) => {
	if (target instanceof Element && !elementExists('.js-details-dialog-spinner', target)) {
		improveShortcutHelp(target);
		observer.disconnect();
	}
});

function observeShortcutModal({key, target}: KeyboardEvent): void {
	if (key !== '?' || isEditable(target)) {
		return;
	}

	const modal = $optional('body > details:not(.js-command-palette-dialog) > details-dialog');
	if (modal) {
		observer.observe(modal, {childList: true});
	}
}

function initOnce(): void {
	document.body.addEventListener('keypress', observeShortcutModal);
}

void features.add(import.meta.url, {
	init: onetime(initOnce),
});

/*

Test URLs: Any page

*/
