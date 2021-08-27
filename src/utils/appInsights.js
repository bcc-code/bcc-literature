import Vue from 'vue';
import session from '../store/session.js';

export async function logCustomEvent(customEventName, customEventProperties) {
    customEventProperties.UserId = createAnalyticsId(session.state.userInfo);
    customEventProperties.Age = calculateUserAge(session.state.userInfo.birthdate);
    customEventProperties.Country = session.state.userInfo['https://login.bcc.no/claims/CountryIso2Code'];
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

function calculateUserAge(birthdate) {
    try {
        if (birthdate) {
            const userBirthdate = Date.parse(birthdate.toString());
            const difference = Date.now() - userBirthdate;
            var ageDateTime = new Date(difference);
    
            return Math.abs(ageDateTime.getUTCFullYear() - new Date(0).getFullYear());
        }
        return 0;
    }
    catch (e) {
        console.log("Birthday date parsing exception: " + e);
        return 0;
    }
}