window.onload = function() {
    // Localize all elements on load
    localizePage()

    const addButton = document.getElementById("add-button");
    const mainList = document.getElementById("main-list");

    addButton.addEventListener("click", addTemplate);
    
    // The addTemplate function asks the user to input a title and text for a new template
    // If both the title and text are provided, then they will be saved to Chrome's sync storage
    // After adding the new template, the list of templates is reloaded to display the new template
    function addTemplate () {
        const title = window.prompt(chrome.i18n.getMessage("enter_new_template_title"));
        if(title){
            const text = window.prompt(chrome.i18n.getMessage("enter_new_template_text"));
            if (text) {
                getTemplatesFromStorage().then(templates => {
                    templates.push({ title, text });
                    chrome.storage.sync.set({ templates });
                    populateTemplates();
                });
            }
        }
    }
    
    // The removeTemplate function removes a template from Chrome's sync storage
    // After removing the template, the list of templates is reloaded to reflect the change
    function removeTemplate(event) {
        event.stopPropagation();
        getTemplatesFromStorage().then(templates => {
            const index = Array.from(mainList.children).indexOf(event.target.closest("li"));
            templates.splice(index, 1);
            chrome.storage.sync.set({ templates });
            populateTemplates();
        })
    }

    // The populateTemplates function loads all templates from Chrome's sync storage
    // It populates the list of templates in the HTML of the extension
    function populateTemplates() {
        mainList.innerHTML = "";
        getTemplatesFromStorage().then(templates => {
            templates.forEach(({ title, text }) => {
                const li = document.createElement("li");
    
                const removeButton = document.createElement("span");
                // Based on Material Symbols: Delete Forever
                removeButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" class="remove-icon">
                        <path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/>
                    </svg>
                `;
                removeButton.alt = "Delete Icon for removing template"
                removeButton.classList.add("remove-button");
                removeButton.addEventListener("click", removeTemplate);
    
                const textNode = document.createElement("span");
                textNode.textContent = title;
                textNode.classList.add("list-entry");
                textNode.addEventListener("click", () => {
                    navigator.clipboard.writeText(text);
                });
    
                li.appendChild(removeButton);
                li.appendChild(textNode);
                mainList.appendChild(li);
            });
        })
    }
    
    // The getTemplatesFromStorage function returns a promise that resolves with the list of templates from Chrome's sync storage
    async function getTemplatesFromStorage() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get("templates", ({ templates }) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(templates || []);
                }
            });
        });
    }
    
    // Initially populates the list of templates when the extension is loaded
    populateTemplates();

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
}