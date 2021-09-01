import baseApi from './baseApi';

export default {
    getAllFeatureFlags
};

async function getAllFeatureFlags(email) {
    return await baseApi.sendRequest("get", "FeatureFlag/all/" + email);
}