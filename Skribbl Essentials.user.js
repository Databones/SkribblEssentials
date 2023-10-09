// ==UserScript==
// @name         Skribbl Essentials 2.4
// @match        *://skribbl.io/*
// @author       Databones
// @description  Provides a list of potential words for skribbl.io
// @icon         https://raw.githubusercontent.com/Databones/SkribblEssentials/main/logoGIF.gif
// @version      2.4
// @license      MIT
// @namespace    skribblessentials
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// ==/UserScript==

// ──  FEATURES  ──
// 📄 Suggestions tab: Generate a list of potential guesses.
// 🖼️ Themes: Customize the background to your liking.
// 📦 Compact chat: Have the chat more instant and compact.
// 💾 Saveable private room settings: Save and load the settings you use for private rooms.
// 🎩 Hats: Allows you to wear hats seen by other players using only ASCII characters
// #️⃣ Special character usernames: Allows you to use all special characters by spoofing with lookalikes.
// 🔤 Fixed character limit: Enjoy an extended 14-character username.

(function () {
    'use strict';

const versionFileURL = 'https://raw.githubusercontent.com/Databones/SkribblEssentials/main/version';
const redirectURL = 'https://github.com/Databones/SkribblEssentials/raw/main/Skribbl%20Essentials.user.js';

async function fetchRemoteVersion() {
    const response = await fetch(versionFileURL);
    const remoteVersion = await response.text();
    const currentVersion = GM_info.script.version;

    if (remoteVersion.trim() !== currentVersion.trim()) {
        window.location.href = redirectURL;
    }
}

// Ensure your script runs in the appropriate environment before calling fetchRemoteVersion()
if (typeof GM_info !== 'undefined' && GM_info.script) {
    fetchRemoteVersion();
}


    function addStyles(styles) {
        const style = document.createElement('style');
        style.textContent = styles;
        document.head.appendChild(style);
    }

    addStyles(`
  .powered-by-skribbl-essentials {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font: inherit;
    margin-top: 10px;
  }
`);

    const logoLink = document.createElement('a');
    logoLink.href = 'https://github.com/Databones/SkribblEssentials';
    logoLink.target = '_blank';
    logoLink.style.textDecoration = 'none';

    const customLogoDiv = document.createElement('div');
    customLogoDiv.className = 'powered-by-skribbl-essentials';
    customLogoDiv.style.userSelect = 'none';
    customLogoDiv.style.pointerEvents = 'none';
    customLogoDiv.innerHTML = `
  Powered by Skribbl Essentials 2.4
  <img src="https://raw.githubusercontent.com/Databones/SkribblEssentials/main/logoGIF.gif" alt="Skribbl Essentials Icon" style="width: 25px; margin-left: 5px;">
`;

    logoLink.appendChild(customLogoDiv);

    const logoBigDiv = document.querySelector('div.logo-big');
    if (logoBigDiv) {
        logoBigDiv.appendChild(logoLink);
    }

    function changeBackground(imageURL, repeat) {
        const img = new Image();
        img.src = imageURL;
        img.onload = function () {
            const isSquare = img.width === img.height;
            document.body.style.backgroundImage = `url(${imageURL})`;
            document.body.style.backgroundRepeat = isSquare ? 'repeat' : 'no-repeat';
            document.body.style.backgroundSize = isSquare ? 'auto' : 'cover';
            const svgElements = document.querySelectorAll('svg[viewBox="0 0 1 1"][preserveAspectRatio="none"]');
            svgElements.forEach(element => {
                element.remove();
                const styleElement = document.createElement('style');
                styleElement.innerHTML = ':root { --COLOR_PANEL_BG: rgba(12, 44, 150, 0.0) !important; }';
                document.head.appendChild(styleElement);
            });
        };
    }

    function handleThemingButtonClick() {
        const imageURL = prompt("Enter the image URL:");
        if (imageURL) {
            GM_setValue('backgroundImageURL', imageURL);
            GM_setValue('backgroundRepeat', false);
            changeBackground(imageURL, false);
        }
    }

    function handleResetButtonClick() {
        const defaultBackgroundImageURL = '/img/background.png';
        const defaultBackgroundRepeat = true;

        changeBackground(defaultBackgroundImageURL, defaultBackgroundRepeat);

        GM_setValue('backgroundImageURL', defaultBackgroundImageURL);
        GM_setValue('backgroundRepeat', defaultBackgroundRepeat);
    }

    function toggleSuggestions() {
        const currentSetting = GM_getValue('suggestions', true);
        const newSetting = !currentSetting;
        GM_setValue('suggestions', newSetting);
        updateToggleButton(newSetting);
        window.location.reload();
    }

    function toggleCompactChat() {
        const currentSetting = GM_getValue('compactChat', false);
        const newSetting = !currentSetting;
        GM_setValue('compactChat', newSetting);
        updateCompactChatButton(newSetting);
        window.location.reload();
    }

    function updateToggleButton(enabled) {
        const toggleButton = document.getElementById('suggestionsToggleButton');
        if (enabled) {
            toggleButton.style.backgroundColor = 'green';
        } else {
            toggleButton.style.backgroundColor = 'red';
        }
    }

    function updateCompactChatButton(enabled) {
        const compactChatButton = document.getElementById('compactChatToggleButton');
        if (enabled) {
            compactChatButton.style.backgroundColor = 'green';
        } else {
            compactChatButton.style.backgroundColor = 'red';
        }
    }

    const sectionContainers = document.querySelectorAll('.section-container');
    sectionContainers.forEach(container => {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        const buttons = [
            createButton('Add custom background', handleThemingButtonClick),
            createButton('Reset', handleResetButtonClick),
        ];

        const suggestionsToggleButton = createButton('Suggestions Tab', toggleSuggestions);
        suggestionsToggleButton.id = 'suggestionsToggleButton';
        buttons.push(suggestionsToggleButton);

        const compactChatToggleButton = createButton('Compact Chat', toggleCompactChat);
        compactChatToggleButton.id = 'compactChatToggleButton';
        buttons.push(compactChatToggleButton);

        buttons.forEach(button => container.appendChild(button));
    });

    const savedImageURL = GM_getValue('backgroundImageURL');
    const backgroundRepeat = GM_getValue('backgroundRepeat');
    if (savedImageURL) {
        changeBackground(savedImageURL, backgroundRepeat);
    }

    const suggestionsEnabled = GM_getValue('suggestions', true);
    updateToggleButton(suggestionsEnabled);

    const compactChatEnabled = GM_getValue('compactChat', false);
    updateCompactChatButton(compactChatEnabled);

    function createButton(text, clickHandler) {
        const button = document.createElement('button');
        button.textContent = text;
        Object.assign(button.style, {
            borderRadius: '5px',
            padding: '5 5px',
            margin: '10 5px',
            color: 'black',
        });
        button.addEventListener('click', clickHandler);
        return button;
    }

    function changeMaxLength() {
        const inputElements = document.querySelectorAll('input.input-name[data-translate="placeholder"]');
        inputElements.forEach(element => element.setAttribute('maxlength', '14'));
    }

    function loadSettings() {
        const settingIds = ["item-settings-rounds", "item-settings-slots", "item-settings-language", "item-settings-drawtime", "item-settings-wordcount", "item-settings-hints"];

        for (const settingId of settingIds) {
            const value = GM_getValue(settingId);
            if (value !== undefined) {
                const element = document.getElementById(settingId);
                if (element && element.tagName === "SELECT") {
                    element.value = value;

                    const event = new Event("change", {
                        bubbles: true
                    });
                    element.dispatchEvent(event);
                }
            }
        }

        const customWordsOnlyCheckbox = document.getElementById("item-settings-customwordsonly");
        if (customWordsOnlyCheckbox) {
            const checkboxValue = GM_getValue("item-settings-customwordsonly");
            if (checkboxValue !== undefined) {
                customWordsOnlyCheckbox.checked = checkboxValue === "on";
                customWordsOnlyCheckbox.dispatchEvent(new Event("change", {
                    bubbles: true
                }));
            }
        }

        const customWordsTextarea = document.getElementById("item-settings-customwords");
        if (customWordsTextarea && customWordsTextarea.dataset.loaded !== "true") {
            const textareaValue = GM_getValue("item-settings-customwords");
            if (textareaValue !== undefined) {
                customWordsTextarea.value = textareaValue;
                customWordsTextarea.dispatchEvent(new Event("input", {
                    bubbles: true
                }));
                customWordsTextarea.dataset.loaded = "true";
            }
        }
    }

    function storeSetting(settingId, value) {
        GM_setValue(settingId, value);
    }

    document.addEventListener("change", (event) => {
        if (event.target.matches("select, input[type='checkbox'], textarea")) {
            const settingId = event.target.id;
            const value = event.target.type === "checkbox" ? (event.target.checked ? "on" : "off") : event.target.value;
            storeSetting(settingId, value);
        }
    });

    function checkForRoomShow() {
        const roomShowDiv = document.querySelector("div.room.show");
        if (roomShowDiv) {

            loadSettings();
        }
    }

    const observer = new MutationObserver(checkForRoomShow);

    const observerConfig = {
        childList: true,
        subtree: true
    };

    observer.observe(document, observerConfig);

    const compactChat = GM_getValue('compactChat', false);

    if (compactChat) {

        GM_addStyle(`
            #game-chat .chat-container .chat-content p {
                padding: 0 !important;
                animation: none !important;
                transition: none !important;
            }
        `);
    }

    const replacements = {
        'dz': 'ǳ',
        '\\.': '․',
        'Dz': 'ǲ',
        'DZ': 'Ǳ',
        'LJ': 'Ǉ',
        'Lj': 'ǈ',
        'lj': 'ǉ',
        'NJ': 'Ǌ',
        'Nj': 'ǋ',
        'nj': 'ǌ',
        '\\$': '＄',
        '#': 'ⵌ',
        '%': '％',
        '&': '＆',
        '\\(': '（',
        '\\)': '）',
        '\\+': '＋',
        ',': '，',
        '\\/': '／',
        '\\\\': '＼',
        ':': '׃',
        '\\?': '？',
        '\\{': '｛',
        '｝': '}',
        '<': 'ᐸ',
        '>': 'ᐳ',
        "'": '՚',
        '"': '‟'
    };

    function replaceCharacterCombinations(e) {
        const inputElement = e.target;
        let newValue = inputElement.value;

        for (const pattern in replacements) {
            if (replacements.hasOwnProperty(pattern)) {
                const regex = new RegExp(pattern, 'g');
                newValue = newValue.replace(regex, replacements[pattern]);
            }
        }

        inputElement.value = newValue;
    }

    const inputField = document.querySelector('input.input-name[type="text"][placeholder="Enter your name"]');

    if (inputField) {

        inputField.addEventListener('input', replaceCharacterCombinations);
    }

    function modifyPlayerName() {
        const targetDiv = document.querySelector('div.player-name.me');

        if (targetDiv) {

            targetDiv.classList.remove('me');
            targetDiv.classList.add('player-name');

            targetDiv.textContent = targetDiv.textContent.replace(' (You)', '');

        }
    }

    const observer2 = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                modifyPlayerName();
            }
        }
    });

    const targetNode = document.body;
    const config = {
        childList: true,
        subtree: true
    };
    observer2.observe(targetNode, config);

    const avatars = [{
        imageUrl: 'https://raw.githubusercontent.com/Databones/SkribblEssentials/main/avatars/Eyeball.png',
        avatarData: [0, 3, 0],
        name: 'ǱǱǱ       👁👁',

        partsToChange: [1],
    },
                     {
                         imageUrl: 'https://raw.githubusercontent.com/Databones/SkribblEssentials/main/avatars/Dark.png',
                         avatarData: [0, 26, 0],
                         name: 'ﾠﾠ          ⬤⬤',

                         partsToChange: [1],
                     },
                     {
                         imageUrl: 'https://raw.githubusercontent.com/Databones/SkribblEssentials/main/avatars/Creepy.png',
                         avatarData: [0, 42, 0],
                         name: 'ﾠﾠ          ◉◉',

                         partsToChange: [1],
                     },
                     {
                         imageUrl: 'https://raw.githubusercontent.com/Databones/SkribblEssentials/main/avatars/Pupils.png',
                         avatarData: [0, 35, 0],
                         name: 'ﾠﾠ          ⬤⬤',

                         partsToChange: [1],
                     },
                     {
                         imageUrl: 'https://raw.githubusercontent.com/Databones/SkribblEssentials/main/avatars/Nose.png',
                         avatarData: [0, 0, 0],
                         name: 'ﾠﾠ          👃',

                         partsToChange: [-1],
                     },
                     {
                         imageUrl: 'https://raw.githubusercontent.com/Databones/SkribblEssentials/main/avatars/PigSnout.png',
                         avatarData: [0, 0, 0],
                         name: 'ﾠﾠ          🐽',

                         partsToChange: [-1],
                     },
                     {
                         imageUrl: 'https://raw.githubusercontent.com/Databones/SkribblEssentials/main/avatars/Sweat.png',
                         avatarData: [0, 0, 0],
                         name: 'ㅤ       ㅤ💧',

                         partsToChange: [-1],
                     },
                     {
                         imageUrl: 'https://raw.githubusercontent.com/Databones/SkribblEssentials/main/avatars/Lips.png',
                         avatarData: [0, 0, 6],
                         name: 'ﾠﾠ          👄',

                         partsToChange: [2],
                     },
                     {
                         imageUrl: 'https://raw.githubusercontent.com/Databones/SkribblEssentials/main/avatars/Stars.png',
                         avatarData: [0, 0, 0],
                         name: 'ㅤ       ✨',

                         partsToChange: [-1],
                     },
                    ];

    const panelRightElements = document.querySelectorAll('.panel-right .ad-side');

    for (const panelRightElement of panelRightElements) {
        panelRightElement.parentElement.removeChild(panelRightElement);
    }

    function applyAvatar(avatar) {

        const currentAvatarData = JSON.parse(localStorage.getItem('ava'));

        avatar.partsToChange.forEach((index) => {
            currentAvatarData[index] = avatar.avatarData[index];
        });

        localStorage.setItem('ava', JSON.stringify(currentAvatarData));

        if (avatar.name) {
            localStorage.setItem('name', avatar.name);
        }

        window.location.reload();
    }

    const numRows = 3;
    const numCols = 5;

    const panelRight = document.querySelector('.panel-right');

    for (let i = 0; i < numRows; i++) {
        const row = document.createElement('div');
        row.className = 'avatar-row';

        for (let j = 0; j < numCols; j++) {
            const index = i * numCols + j;
            if (index < avatars.length) {
                const avatar = avatars[index];

                const button = document.createElement('button');
                button.style.cursor = 'pointer';

                const image = document.createElement('img');
                image.src = avatar.imageUrl;
                image.draggable = false;
                image.style.userSelect = 'none';

                button.style = `
                width: 92px;
                height: 111px;
                padding: 10px;
                background-color: transparent;
                border: none;
                margin: 5px;
            `;

                button.appendChild(image);

                button.addEventListener('click', () => {
                    applyAvatar(avatar);
                });

                row.appendChild(button);
            }
        }

        panelRight.appendChild(row);
    }

    const isSuggestionsEnabled = GM_getValue('suggestions', true);
    if (!isSuggestionsEnabled) {
        return;
    }

    const form = document.querySelector('form');
    const chatInput = document.querySelector('form input[placeholder="Type your guess here..."]');
    const chatContent = document.querySelector('.chat-content');
    const hintsContainer = document.querySelector('.hints .container');
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'suggestions';
    suggestionsDiv.style.maxHeight = '150px';
    suggestionsDiv.style.overflowY = 'auto';
    form.appendChild(suggestionsDiv);

    const clickedButtons = new Set();
    let wordList = [];

    function isWordListValid() {
        const storedData = localStorage.getItem("wordListData");
        if (storedData) {
            const {
                timestamp,
                data
            } = JSON.parse(storedData);
            const now = new Date().getTime();

            if (now - timestamp <= 24 * 60 * 60 * 1000) {
                wordList = data.split('\n');
                return true;
            }
        }
        return false;
    }

    function fetchWordList() {
        if (!isWordListValid()) {
            fetch("https://raw.githubusercontent.com/Databones/SkribblEssentials/main/wordList")
                .then(response => response.text())
                .then(data => {
                const timestamp = new Date().getTime();
                localStorage.setItem("wordListData", JSON.stringify({
                    timestamp,
                    data
                }));
                wordList = data.split('\n');
                updateSuggestions();
            })
                .catch(error => {
                console.error("Error fetching data:", error);
            });
        }
    }

    function updateSuggestions() {
        const inputText = chatInput.value.toLowerCase();
        const hintElements = hintsContainer.querySelectorAll('.hint');
        const hintText = Array.from(hintElements).map(element => {
            if (element.classList.contains('uncover')) {
                return element.textContent;
            } else {
                return element.textContent.replace(/_/g, '[^\\s-]');
            }
        }).join('');

        const hintRegExp = new RegExp(`^${hintText}$`);
        const chatTextSpans = chatContent.querySelectorAll('p[style*="var(--COLOR_CHAT_TEXT_BASE)"] span');
        const chatText = Array.from(chatTextSpans).map(span => span.textContent.trim().toLowerCase());

        const filteredWords = wordList.filter(word => {
            return hintRegExp.test(word) && !chatText.includes(word.toLowerCase()) && !clickedButtons.has(word.toLowerCase());
        });

        suggestionsDiv.innerHTML = '';
        const fragment = document.createDocumentFragment();

        filteredWords.forEach(word => {
            if (word.includes(inputText)) {
                const button = document.createElement('button');
                button.textContent = word;
                button.style.color = 'black';
                button.style.margin = '5px';
                button.style.borderRadius = '5px';

                button.style.userSelect = 'none';

                fragment.appendChild(button);
            }
        });

        suggestionsDiv.appendChild(fragment);
    }



    let debounceTimeout;
    chatInput.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(updateSuggestions, 50);
    });

    suggestionsDiv.addEventListener('mousedown', (event) => {
        if (event.target.tagName === 'BUTTON') {
            event.preventDefault();
            const lowercaseWord = event.target.textContent.toLowerCase(); // Convert to lowercase
            chatInput.value = lowercaseWord;
            clickedButtons.add(lowercaseWord);

            const inputEvent = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            chatInput.dispatchEvent(inputEvent);

            const submitEvent = new Event('submit', {
                bubbles: true,
                cancelable: true,
            });
            form.dispatchEvent(submitEvent);
        }
    });

    const observerConfig3 = {
        subtree: true,
        childList: true
    };

    const observer3 = new MutationObserver(updateSuggestions);
    observer3.observe(hintsContainer, observerConfig3);
    const chatObserver = new MutationObserver(updateSuggestions);
    chatObserver.observe(chatContent, {
        childList: true,
        subtree: true
    });

    fetchWordList();

    updateSuggestions();

    window.addEventListener('load', changeMaxLength);

    window.addEventListener('load', modifyPlayerName);
})();
