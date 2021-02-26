import baseApi from './baseApi';

export default {
    isSubscribedTo,
    subscribeTo,
    unsubscribeTo,
    getSubscriptionOverview
};

async function isSubscribedTo(bookId) {
    return await baseApi.sendRequest("get", "subscriptions/isSubscribed/" + bookId);
}
async function subscribeTo(bookId, userInformation) {
    return await baseApi.sendRequest("post", "subscriptions/subscribe/"+ bookId, userInformation, {'Content-Type': 'application/json'});
}
async function unsubscribeTo(bookId, userInformation) {
    return await baseApi.sendRequest("post", "subscriptions/unsubscribe/"+ bookId, userInformation, {'Content-Type': 'application/json'} );
}

async function getSubscriptionOverview(personId){
    return await baseApi.sendRequest("get", "subscriptions/overview/"+ personId);
}
