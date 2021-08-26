import baseApi from './baseApi';

export default {
    getAudioBookTracks
};

/**
 * Search on articles
 * @param {int} bookId
 */
async function getAudioBookTracks(bookId) {   
    return await baseApi.sendCustomRequest("get", `${baseApi.bmmBaseUri}/albums/${bookId}`);
}



