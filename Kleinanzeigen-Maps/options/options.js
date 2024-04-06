window.onload = function() {
    // Localize all elements on load
    localizePage()

    document.addEventListener('DOMContentLoaded', restoreOptions);
    document.getElementById('save').addEventListener('click', saveOptions);
    document.getElementById('modus').addEventListener('change', optionVisiblity);

    restoreOptions()
    optionVisiblity()
}

function optionVisiblity(){
    const modus = document.getElementById('modus').value;
    if(modus === "startLocation"){
        document.getElementById('startLocationDiv').hidden = false
    }
    else if(modus === "onlyView"){
        document.getElementById('startLocationDiv').hidden = true
    }
}


// Saves options to chrome.storage
const saveOptions = () => {
    const modus = document.getElementById('modus').value;
    const startLocation = document.getElementById('startLocation').value;

    chrome.storage.sync.set({ modus: modus, startLocation: startLocation }, () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = chrome.i18n.getMessage("options_saved");
        setTimeout(() => {
            status.textContent = '';
        }, 750);
    });
};
  
// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
chrome.storage.sync.get({ modus: 'onlyView', startLocation: "" }, (items) => {
    document.getElementById('modus').value = items.modus;
    optionVisiblity();
    document.getElementById('startLocation').value = items.startLocation;
});
};

function localizePage() {
    // Select all HTML elements that have the 'data-i18n' attribute.
    const i18nElements = document.querySelectorAll('[data-i18n]');

    // For each such element...
    i18nElements.forEach(element => {
        // Get the value of the 'data-i18n' attribute, which is the key of the message in the locale file,
        // Retrieve the corresponding localized message using the chrome.i18n.getMessage() function,
        // Replace the text content of the element with the localized message.
        element.textContent = chrome.i18n.getMessage(element.getAttribute('data-i18n'));
    });
}
