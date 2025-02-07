import React from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';

import { ROOT_URL } from './consts';

function openWikiToReport(title: string) {
    // TODO this function should use stuff typed inside the popup dialog,
    // but for now, it's just using consts for testing

    const titleEncoded = encodeURIComponent(title.trim());

    const url = `${ROOT_URL}/index.php?title=${titleEncoded}&action=edit`;

    function prepopulateEditPage() {
        // the link of the page in which you clicked the report button from
        const previousLink = "https://google.com";

        const textbox = document.querySelector("#wpTextbox1");
        if (textbox instanceof HTMLTextAreaElement) {
            textbox.value = `Type your report here. \n\nThe link you came from, should you wish to include it in the new article, is: "${previousLink}"`;
        }
    }

    chrome.tabs.create({ url }, (tab) => {
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
            if (tabId === tab.id && changeInfo.status === "complete") {
                chrome.tabs.onUpdated.removeListener(listener);
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: prepopulateEditPage,
                });
            }
        });
    });
}

const Popup: React.FC = () => {
    const [view, setView] = React.useState<"main" | "report">("main");

    const toggleEnabled = () => {
        // TODO
    };

    const openCATPage = () => {
        // TODO:
    };

    const reportWithParams = () => {
        const title = (document.getElementById("report-title") as HTMLInputElement)?.value;

        if (title) {
            openWikiToReport(title);
        } else {
            document.getElementById("report-title-empty-warning")!.style.display = "block";
        }
    };

    const allowThisSite = () => {
        // TODO:
    };

    const excludeThisSite = () => {
        // TODO:
    };

    const openOptionsPage = () => {
        void chrome.runtime.openOptionsPage();
    };

    return (
        <div className="popup-container">
            <h2>ClintonCAT</h2>

            {/* Main menu */}
            {view === "main" && (
                <div>
                    <button
                        className="popup-button"
                        onClick={toggleEnabled}>
                        Toggle On/Off
                    </button>
                    <button
                        className="popup-button"
                        onClick={openCATPage}>
                        Open CAT page
                    </button>
                    <button
                        className="popup-button"
                        onClick={() => { setView("report"); }}>
                        Report this site to CAT
                    </button>
                    <button
                        className="popup-button"
                        onClick={allowThisSite}>
                        Allow this site
                    </button>
                    <button
                        className="popup-button"
                        onClick={excludeThisSite}>
                        Exclude this site
                    </button>
                    <button
                        className="popup-button"
                        onClick={openOptionsPage}>
                        Go to Options
                    </button>
                </div>
            )}

            {/* Report menu, asks for more info before opening the creation page */}
            {view === "report" && (
                <div id="report-menu">
                    <h3>Report to CAT</h3>
                    <input id="report-title" type="text" placeholder="Article Title" />
                    <p id="report-title-empty-warning"
                        style={{ display: "none" }}>Cannot be empty.</p>

                    <p>This creates a mostly empty article, for people who write a lot and know what they're doing. If you're new to writing articles, you should probably use <a href="https://wiki.rossmanngroup.com/wiki/Consumer_Action_Taskforce:New_here">this</a> instead.</p>

                    {/* TODO: add a little search widget to help them do this */}
                    <p>Please make sure the article doesn't already exist before creating it.</p>

                    <button
                        className="popup-button"
                        onClick={reportWithParams}>
                        Start
                    </button>
                    <button
                        className="popup-button"
                        onClick={() => { setView("main"); }}>
                        Back
                    </button>
                </div>
            )}
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
