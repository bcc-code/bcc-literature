import baseApi from './baseApi';

export default {
    getAuthor,
    getAllAuthors,
    search
};

/**
 * Get an author from Id
 * @param {int} id 
 */
async function getAuthor(id){
    return await baseApi.sendRequest("get","authors/"+id);
}

/**
 * Get a list of all the authors
 */
async function getAllAuthors(){
    var allAuthors = await baseApi.sendRequest("get","authors/all");
    var popularAuth = await baseApi.sendRequest("get","authors/popular");
    return { all: allAuthors.data, popular: popularAuth.data };
}

async function search(query) {
    return await baseApi.sendRequest("get", "authors/search/" + query);
}