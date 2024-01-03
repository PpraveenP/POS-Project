export function googleTranslateElementInit() {
    // Initialize Google Translate
    new google.translate.TranslateElement(
        {pageLanguage:'en'},
        'google_translate_element'
    );

    // Customize the Icon (Optional)
    var iconUrl = 'URL_OF_YOUR_ICON'; // Replace with the actual URL of your icon
    var iconElement = document.querySelector('.goog-te-gadget-icon');
    if (iconElement) {
        iconElement.style.backgroundImage = 'url(' + iconUrl + ')';
    }
}