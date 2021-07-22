import Vue from 'vue';
import session from '../store/session.js';

export async function logCustomEvent(customEventName, customEventProperties) {
    customEventProperties.UserId = createAnalyticsId(session.state.userInfo);
    Vue.appInsights.trackEvent({
        name: customEventName, 
        properties: customEventProperties
    });
}

function createAnalyticsId(userInfo) {
    var personId = userInfo['https://login.bcc.no/claims/personId'].toString();
    var subject = userInfo['sub'];

    var stringToHash = personId + subject;
    var md5 = require('md5');
    var hash = md5([...Buffer.from(stringToHash, 'utf-8')]);

    return hash.toUpperCase();
}