import baseApi from './baseApi';

export default {
    getAllFeatureFlags
};

async function getAllFeatureFlags() {
    return await baseApi.sendRequest("get", "FeatureFlag/all");
}