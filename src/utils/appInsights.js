import keys from 'keys';
import session from '../store/session.js';
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({ config: {
    instrumentationKey: keys.APP_INSIGHTS,
    autoTrackPageVisitTime: true
}});
appInsights.loadAppInsights();

export async function logCustomEvent(customEventName, customEventProperties) {
    appInsights.trackEvent({
        name: customEventName, 
        properties: addUserDataProperties(customEventProperties)
    });
}

export async function logPageView(pageName, pageViewProperties) {
    appInsights.trackPageView({
        name: pageName,
        properties: addUserDataProperties(pageViewProperties)
    });
}

function addUserDataProperties(properties) {
    properties.UserId = createAnalyticsId(session.state.userInfo);
    properties.Age = calculateUserAge(session.state.userInfo.birthdate);
    properties.Country = session.state.userInfo['https://login.bcc.no/claims/CountryIso2Code'];
    
    return properties;
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