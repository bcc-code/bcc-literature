import baseApi from './baseApi';

export default {
    getBook,
    getBookTranslations,
    getAllBooks,
    getChaptersByBookId,
    getMonthlyPublicationsForYear,
    getYearsByPublication,
    getPublicationInformation,
    search
};

/**
 * Get a Book from Id
 * @param {int} id
 */
async function getBook(id) {
    return await baseApi.sendRequest("get", "books/" + id);
}

/**
 * Get all translations for a Book by Id
 * @param {int} id
 */
async function getBookTranslations(id) {
    return await baseApi.sendRequest("get", "books/" + id + "/translations");
}

/**
 * Get a list of all books
 * @return {Promise}
 */
async function getAllBooks() {
    var books = await baseApi.sendRequest("get", "books/all");
    var publications = await baseApi.sendRequest("get", "subscriptions/overview");
    books.data = books.data.concat(publications.data);
    return books;
}

/**
 * Get a list of all books
 * @return {Promise}
 */
async function getChaptersByBookId(id) {
    return await baseApi.sendRequest("get", "books/" + id + "/chapters");
}

async function getYearsByPublication(publicationId) {
    return await baseApi.sendRequest("get", "books/publication/" + publicationId)
}

async function getMonthlyPublicationsForYear(publicationId, year) {
    return await baseApi.sendRequest("get", "books/publication/" + publicationId + "/" + year)
}

async function getPublicationInformation(id) {
    return await baseApi.sendRequest("get", "books/" + id +"/price");
}

async function search(query) {
    return await baseApi.sendRequest("get", "books/search/" + query);
}