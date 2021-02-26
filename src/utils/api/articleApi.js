import baseApi from './baseApi';

export default {
    search,
    getArticle,
    getArticlesByAuthor,
    getByBookAndChapter,
    getArticlesForPublicationMonth
};

/**
 * Search on articles
 * @param {string} query
 */
async function search(query, top, skip, authorFullNameFacet, bookNameFacet, years, exactMatch) {   
    var authorFullNameRequest = authorFullNameFacet.map( el => `&AuthorFullName=${el}`).join('');
    var bookNameRequest = bookNameFacet.map( el => `&BookName=${el}`).join('');
    var yearsRequest = years.map(el => `&Years=${el}`).join('');
    return await baseApi.sendRequest("get", `article/search/${query}/?Top=${top}&Skip=${skip}&ExactMatch=${exactMatch}${authorFullNameRequest}${bookNameRequest}${yearsRequest}`);
}

/**
 * Get an article from Id
 * @param {int} id
 */
async function getArticle(id) {
    return await baseApi.sendRequest("get", "Article/" + id);
}

/**
 * Get a list of all the books by this author
 */
async function getArticlesByAuthor(id) {
    return await baseApi.sendRequest("get","Article/author/" + id);
}

/**
 * Get by book and chapter
 * @param {int} bookId
 * @param {int} chapterId
 */
async function getByBookAndChapter(bookId, chapterId) {
    return await baseApi.sendRequest("get", "Article/full/byBookIdAndChapterId/" + bookId + '/' + chapterId);
}

/**
 * Get articles for a publicationMonth
 * @param {int} publicationId
 * @param {int} year
 * @param {int} month
 */
async function getArticlesForPublicationMonth(publicationId, year, month) {
    return await baseApi.sendRequest("get", "Article/publication/" + publicationId + "/" + year + "/" + month)
}

