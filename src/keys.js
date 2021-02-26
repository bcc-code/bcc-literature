const keys = {};

keys.env = process.env.KEYS_ENV;
keys.AUTH0_DOMAIN = 'https://login.bcc.no';
keys.AUTH0_CLIENT_ID = 'X0ac7C8sROIhEzRGLJPFpLCZAlKGK4KV';
keys.API_AUDIENCE = 'https://literatureapi.bcc.no';

if (keys.env === 'local') {
    keys.API_BASE_PATH = 'http://localhost:58330/api/';
    keys.APP_INSIGHTS = '6856efb0-33a0-40ec-898a-fa1676670481';
    keys.APP_URL = "http://literature.local:21535/";
} else if (keys.env === 'development') {
    keys.API_BASE_PATH = 'https://devliteratureapi.bcc.no/api/';
    keys.APP_INSIGHTS = '6856efb0-33a0-40ec-898a-fa1676670481';
    keys.APP_URL = "https://devliterature.bcc.no/";
} else {
    keys.API_BASE_PATH = 'https://literatureapi.bcc.no/api/';
    keys.APP_INSIGHTS = '14dc7370-d646-4de8-ae9b-71b8519fc3e3';
    keys.APP_URL = "https://literature.bcc.no/";
}


export default keys;
