import axios from 'axios';
import keys from 'keys';
import store from 'store';
import authenticator from 'utils/auth';
const baseUri = keys.API_BASE_PATH;

function addLanguageQuery(requestUrl){  
    var langParam = (requestUrl.indexOf('?') > -1 ? "&" : "?") + "lang=" + store.state.session.appLanguage;
    return requestUrl + langParam;
}

/**
 * Create and process the request
 */
async function sendRequest(requestMethod, requestUrl, bodyData = null, headers = {}){
    var accessToken = await authenticator.getAccessToken();
    headers.Authorization = 'Bearer ' + accessToken;
    return axios({
        headers: headers,
        method: requestMethod,
        data: bodyData,
        url: baseUri + addLanguageQuery(requestUrl)
    });
}

/**
 * 
 * @param {string} requestMethod 
 * @param {string} customUrl 
 * @param {*} bodyData 
 * @param {*} headers 
 * @returns 
 */
async function sendCustomRequest(requestMethod, customUrl, bodyData = null, headers = {}){
    var accessToken = await authenticator.getAccessToken();
    headers.Authorization = 'Bearer ' + accessToken;
    return axios({
        headers: headers,
        method: requestMethod,
        data: bodyData,
        url: customUrl
    });
}

async function getDownloadEbookLink(requestUrl){
    return new Promise((resolve, reject) => {
        authenticator.getIdToken().then(
            (idToken) => {
                return resolve(baseUri + requestUrl + "?session=" + idToken);
            }, (err) => {
                console.log(err);
                return reject(err);
            });
    });
}

/**
 * Intercept the 401 response
 */
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => { 
        if (error.response.status === 401) {
            await authenticator.handleError();
        }
        return Promise.reject(error)
    }
);

export default {
    sendRequest,
    sendCustomRequest,
    baseUri,
    getDownloadEbookLink,
    addLanguageQuery,
};
