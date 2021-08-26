const keys = {};

keys.AUTH0_DOMAIN = 'https://login.bcc.no';
keys.AUTH0_CLIENT_ID = 'X0ac7C8sROIhEzRGLJPFpLCZAlKGK4KV';
keys.API_AUDIENCE = 'https://literatureapi.bcc.no';
keys.BMM_API_BASE_PATH = 'https://bmm-api.brunstad.org/';
keys.SUBSCRIPTION_FORM_URLS = {
    312: 'https://band.dcg-deutschland.de/',
};

switch (window.location.hostname) {
case 'literature.bcc.no':
    keys.API_BASE_PATH = 'https://literatureapi.bcc.no/api/';
    keys.APP_INSIGHTS = '14dc7370-d646-4de8-ae9b-71b8519fc3e3';
    keys.APP_URL = 'https://literature.bcc.no/';
    break;
case 'devliterature.bcc.no':
    keys.API_BASE_PATH = 'https://devliteratureapi.bcc.no/api/';
    keys.APP_INSIGHTS = '6856efb0-33a0-40ec-898a-fa1676670481';
    keys.APP_URL = 'https://devliterature.bcc.no/';
    break;
default:
    console.log(process.env);
    keys.API_BASE_PATH = process.env.VUE_APP_API_ENV == 'dev' ? 'https://devliteratureapi.bcc.no/api/' : 'http://localhost:58330/api/';
    keys.APP_INSIGHTS = '6856efb0-33a0-40ec-898a-fa1676670481';
    keys.APP_URL = 'http://literature.local:21535/';
}

export default keys;
