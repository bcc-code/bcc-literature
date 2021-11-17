// BCP 47 language tags
const languageTags = [
    { code: 'no', id: 1, tag: 'nb-NO' },
    { code: 'en', id: 2, tag: 'en-US' },
    { code: 'de', id: 3, tag: 'de-DE' },
    { code: 'nl', id: 4, tag: 'nl-NL' },
    { code: 'af', id: 5, tag: '' },
    { code: 'bg', id: 6, tag: '' },
    { code: 'es', id: 7, tag: 'es-ES' },
    { code: 'dk', id: 8, tag: 'da-DK' },
    { code: 'id', id: 9, tag: 'id-ID' },
    { code: 'fi', id: 11, tag: 'fi-FI' },
    { code: 'fr', id: 12, tag: 'fr-FR' },
    { code: 'ru', id: 13, tag: 'ru-RU' },
    { code: 'hu', id: 14, tag: 'hu-HU' },
    { code: 'pt', id: 15, tag: 'pt-PT' },
    { code: 'luo', id: 16, tag: '' },
    { code: 'sw', id: 17, tag: 'sv-SE' },
    { code: 'sr', id: 18, tag: '' },
    { code: 'it', id: 19, tag: 'it-IT' },
    { code: 'hr', id: 20, tag: '' },
    { code: 'ro', id: 21, tag: 'ro-RO' },
    { code: 'he', id: 22, tag: 'he-IL' },
    { code: 'am', id: 23, tag: '' },
    { code: 'tr', id: 24, tag: 'tr-TR' },
    { code: 'pl', id: 25, tag: 'pl-PL' },
    { code: 'zh', id: 26, tag: 'zh-CN' },
    { code: 'ml', id: 27, tag: '' }
];

export function getLanguageTag(id) {
    const lang = languageTags.find((l) => l.id === id);
    return lang ? lang.tag : 'nb-NO';
}