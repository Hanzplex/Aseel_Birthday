// Bilingual translations for the Birthday Website (English / Arabic)
// Created by geniusinsanity

let currentLang = localStorage.getItem('lang') || 'en';

const translations = {
    en: {
        title: "Happy Birthday Aseel",
        description: "A special birthday surprise for Aseel! Click to see the special message.",
        login: "Sign in with Google",
        logout: "Logout",
        settings: "Website Settings",
        music: "Music Settings",
        backgroundMusic: "Background Music:",
        countdown: "Countdown Settings",
        countdownTime: "Countdown Time:",
        matrix: "Matrix Rain Effect Settings",
        matrixText: "Matrix main text:",
        matrixColor1: "Matrix color 1:",
        matrixColor2: "Matrix color 2:",
        sequence: "Main Text Settings",
        sequenceText: "Main text content:",
        sequenceColor: "Main text color:",
        gift: "Animated Image Settings",
        giftImage: "Animated Image (optional):",
        enableBook: "Show book:",
        book: "Book Page Settings",
        enableHeart: "Show heart effect:",
        note: "Enjoy this special birthday website!",
        follow: "This special birthday website was lovingly created by geniusinsanity.",
        apply: "Apply Settings",
        copyright: 'Made by Hanzplex for Aseel\'s Birthday ((11.9.2026))',
        fullscreen: "Fullscreen",
        on: "On",
        off: "Off",
        sec3: "3 seconds",
        sec5: "5 seconds",
        sec10: "10 seconds",
        noGif: "None",
        colorTheme: "Choose color:",
        settingsHint: "click here to customize settings",
        pinkTheme: "Spider-Man",
        blueTheme: "Cool Blue",
        purpleTheme: "Dreamy Purple",
        customTheme: "Custom Color",
        noteSequence: "Note: Please separate words with | and don't make a line too long",
        noteExpire: "<b>Note:</b> Enjoy this special birthday surprise!",
        followNote: "This special birthday website was lovingly created by geniusinsanity.",
        notVietnamWarning: 'Happy Birthday Aseel! Wishing you a wonderful day filled with joy and love.',
        pageTitleCover: "Page {num} (Cover)",
        pageTitle: "Page {num}",
        imageLabel: "Image:",
        coverPlaceholder: "Book Cover",
        pagePlaceholder: "Page {num}",
        noImageAlt: "No image yet - {placeholder}",
        contentLabel: "Content:",
        contentPlaceholder: "Enter content for page {num}",
        addNewPage: "Add New Page",
        emptyPage: "Empty page",
        endOfBook: "End of book",
        saveSettings: "Save settings"
    },
    
    
};

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Set title and meta
    document.title = translations[lang].title;
    document.querySelector('meta[name="description"]').setAttribute('content', translations[lang].description);

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            if (
                translations[lang][key].includes('<b>') ||
                translations[lang][key].includes('<a')
            ) {
                el.innerHTML = translations[lang][key];
            } else {
                el.innerText = translations[lang][key];
            }
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            el.setAttribute('placeholder', translations[lang][key]);
        }
    });

    // Update lang button text if exists (shows the language you'll switch TO)
    const langBtn = document.getElementById('langSwitchBtn');
    if (langBtn) {
        langBtn.innerText = lang === 'en' ? 'AR' : 'EN';
    }
}

function switchLanguage() {
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
}

document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);

    const langBtn = document.getElementById('langSwitchBtn');
    if (langBtn) {
        langBtn.addEventListener('click', switchLanguage);
    }
});

function t(key, vars = {}) {
    let str = (translations[currentLang] && translations[currentLang][key]) || key;
    Object.keys(vars).forEach(k => {
        str = str.replace(`{${k}}`, vars[k]);
    });
    return str;
}