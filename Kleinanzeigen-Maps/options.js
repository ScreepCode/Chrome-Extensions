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
        status.textContent = 'Options saved.';
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

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('modus').addEventListener('change', optionVisiblity);
