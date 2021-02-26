import BookApi from 'utils/api/bookApi';
import SubscriptionApi from 'utils/api/subscriptionApi';

export default {
    namespaced: true,
    state: {
        isPaidSubscription: false,
        isSubscribed: null,
        price: 0,
        hasMultiModes : false
    },
    mutations: {
        setPrice: (state, value) => {
            state.price = value;
        },
        isPaidSubscription: (state, value) => {
            state.isPaidSubscription = value;
        },
        isSubscribed: (state, value) => {
            state.isSubscribed = value;
        },
        hasMultiModes : (state, value) => {
            state.hasMultiModes = value;
        }
    },
    actions: {
        loadInformation: async ({commit}, id) => {
            return await BookApi.getPublicationInformation(id).then((result) => {
                commit('isPaidSubscription', result.data.isPaidSubscription)
                commit('setPrice', result.data.price);
                commit('hasMultiModes', result.data.hasMultiModes);
            });
        },
        getIsSubscribed: async({commit}, id) => {
            return await SubscriptionApi.isSubscribedTo(id).then((result) => {
                commit('isSubscribed', result.data);
            });
        }
    }
}