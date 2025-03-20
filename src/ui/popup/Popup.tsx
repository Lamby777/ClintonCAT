import Preferences from '@/common/services/preferences';
import ChromeLocalStorage from '@/storage/chrome/chrome-local-storage';
import ChromeSyncStorage from '@/storage/chrome/chrome-sync-storage';
import useEffectOnce from '@/utils/hooks/use-effect-once';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as styles from './Popup.module.css';

import { PRELOADS_AND_EDITINTROS, WIKI_ROOT_URL } from './consts';

// mayhaps helpful links below for API docs
// https://www.mediawiki.org/wiki/API:Edit
// https://www.mediawiki.org/w/api.php?action=help&modules=visualeditor
async function openWikiToReport(title: string, previousLink: string, category: string) {
    const titleEncoded = encodeURIComponent(title.trim());
    // TODO check if article exists here

    const { preload, editintro } = PRELOADS_AND_EDITINTROS[category];
    const boilerplate = encodeURIComponent('Summary goes here ' + previousLink);
    const boilerplate2 = encodeURIComponent('Incident goes here');

    // prepare the url
    const url =
        `${WIKI_ROOT_URL}/index.php?veaction=edit&create=Create+page` +
        `&preload=${preload}&editintro=${editintro}&title=${titleEncoded}` +
        // reuse this parameter for each new section
        `&preloadparams%5b%5d=${boilerplate}` +
        `&preloadparams%5b%5d=${boilerplate2}`;

    // open a tab set to that page
    await chrome.tabs.create({ url });
}

const Popup = () => {
    const [view, setView] = React.useState<'main' | 'report'>('main');
    const [isEnabled, setIsEnabled] = useState(false);

    useEffectOnce(() => {
        Preferences.initDefaults(new ChromeSyncStorage(), new ChromeLocalStorage())
            .then(() => {
                Preferences.isEnabled.addListener('enable-options', (result: boolean) => setIsEnabled(result));
                setIsEnabled(Preferences.isEnabled.value);
            })
            .catch((error: unknown) => console.error('Failed to initialize preferences:', error));

        return () => Preferences.isEnabled.removeListener('enable-options');
    });

    const handleToggleEnabled = () => {
        Preferences.isEnabled.value = !Preferences.isEnabled.value;
    };

    const openCATPage = () => {
        // TODO:
    };

    const reportWithParams = () => {
        // title the user entered
        const title = (document.getElementById('report-title') as HTMLInputElement).value;

        // the link of the page in which you clicked the report button from
        const previousLink = window.location.href;

        if (title) {
            // TODO let them pick a category
            openWikiToReport(title, previousLink, 'incident');
        } else {
            const warning = document.getElementById('report-title-empty-warning');
            if (warning) warning.style.display = 'block';
        }
    };

    const allowThisSite = () => {
        const domain = window.location.hostname; // TODO: gets extension name instead of open tab domain
        Preferences.domainExclusions.delete(domain);
    };

    const excludeThisSite = () => {
        const domain = window.location.hostname; // TODO: gets extension name instead of open tab domain
        Preferences.domainExclusions.add(domain);
    };

    const openOptionsPage = () => {
        void chrome.runtime.openOptionsPage();
    };

    return (
        <div className={styles.popupContainer}>
            <p className={styles.popupTitle}>ClintonCAT</p>
            <div className={styles.divider} />
            <label className={styles.toggleLabel}>
                <span>{isEnabled ? 'Disable' : 'Enable'} ClintonCAT</span>
                <input type="checkbox" checked={isEnabled} onChange={handleToggleEnabled} />
                <span className={`${styles.toggleSlider} ${isEnabled ? styles.toggled : ''}`} />
            </label>

            <div className={styles.divider} />

            {/* Main menu */}
            {view === 'main' && (
                <div className={styles.buttonGroup}>
                    <button className={styles.popupButton} onClick={openCATPage}>
                        Open CAT page
                    </button>
                    <button
                        className={styles.popupButton}
                        onClick={() => {
                            setView('report');
                        }}>
                        Report this site to CAT
                    </button>
                    <button className={styles.popupButton} onClick={allowThisSite}>
                        Allow this site
                    </button>
                    <button className={styles.popupButton} onClick={excludeThisSite}>
                        Exclude this site
                    </button>
                    <button className={styles.popupButton} onClick={openOptionsPage}>
                        Go to Options
                    </button>
                </div>
            )}

            {/* Report menu, asks for more info before opening the creation page */}
            {view === 'report' && (
                <div id="report-menu">
                    <h3>Report to CAT</h3>
                    <input id="report-title" type="text" placeholder="Article Title" />
                    <p id="report-title-empty-warning" style={{ display: 'none' }}>
                        Cannot be empty.
                    </p>

                    <p>
                        This creates a mostly empty article, for people who write a lot and know what they're doing. If
                        you're new to writing articles, you should probably use{' '}
                        <a href={`${WIKI_ROOT_URL}/Consumer_Action_Taskforce:New_here`}>this</a> instead.
                    </p>

                    {/* TODO: add a little search widget to help them do this */}
                    <p>Please make sure the article doesn't already exist before creating it.</p>

                    <button className="popup-button" onClick={reportWithParams}>
                        Start
                    </button>
                    <button
                        className="popup-button"
                        onClick={() => {
                            setView('main');
                        }}>
                        Back
                    </button>
                </div>
            )}
            <div className={styles.divider} />
        </div>
    );
};

const rootElement: HTMLElement | null = document.getElementById('root');
if (rootElement instanceof HTMLElement) {
    const root = createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <Popup />
        </React.StrictMode>
    );
} else {
    throw Error('No root element was found');
}
