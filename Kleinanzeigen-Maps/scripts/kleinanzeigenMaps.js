const GMAPSSEARCHURL = "https://www.google.de/maps/search/";
const GMAPSDIRURL = (startLocation) => {
    return "https://www.google.de/maps/dir/" + startLocation + "/"
}

function buildLinkElement (addressText, gMapsUrl = GMAPSSEARCHURL) {
    const searchURL = gMapsUrl + addressText.trim().replaceAll(" ", "%20");
    
    const addressElementLink = document.createElement("a");
    addressElementLink.id = "viewad-locality";
    addressElementLink.itemprop = "locality";

    addressElementLink.innerHTML = addressText;
    addressElementLink.href = searchURL;
    addressElementLink.target = "_blank";

    return addressElementLink;
}


chrome.storage.sync.get({ modus: 'onlyView', startLocation: "" }, (items) => {
    //Get Address Element
    const addressElement = document.getElementById("viewad-locality");
    const address = addressElement.innerHTML;

    let addressElementLink;
    switch(items.modus){
        case "startLocation":
            addressElementLink = buildLinkElement(address, GMAPSDIRURL(items.startLocation));
            break;
        case "onlyView":
            addressElementLink = buildLinkElement(address, GMAPSSEARCHURL);
            break;
        default:
            addressElementLink = buildLinkElement(address, GMAPSSEARCHURL);
            break;
    }

    //Replace Address Element
    addressElement.replaceWith(addressElementLink);
});