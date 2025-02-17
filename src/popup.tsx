import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as styles from './popup.module.css';
import Preferences from './preferences';

import { WIKI_ROOT_URL } from './consts';

async function openWikiToReport(title: string, previousLink: string) {
    const titleEncoded = encodeURIComponent(title.trim());

    const url = `${WIKI_ROOT_URL}/index.php?veaction=edit`;

    // &preload=Project%3ASample%2FProduct #1
    // &editintro=Project%3ASample%2FProduct%2FHelp #1
    // &title=Title+name #2
    // &create=Create+page
    // &preloadparams%5b%5d=Summary%20goes%20here #3
    // &preloadparams%5b%5d=Incident%20goes%20here #3
    //
    // TODO https://github.com/WayneKeenan/ClintonCAT/issues/45#issuecomment-2646190793
}

const Popup = () => {
    const [view, setView] = React.useState<'main' | 'report'>('main');
    const [isEnabled, setIsEnabled] = useState(false);

    const handleToggleEnabled = () => {
        // TODO:
        setIsEnabled(() => {
            Preferences.isEnabled.value = !Preferences.isEnabled.value;
            return Preferences.isEnabled.value;
        });
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
            openWikiToReport(title, previousLink);
        } else {
            const warning = document.getElementById('report-title-empty-warning');
            if (warning) warning.style.display = 'block';
        }
    };

    const allowThisSite = () => {
        // TODO:
    };

    const excludeThisSite = () => {
        // TODO:
        const domain = window.location.hostname;
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
