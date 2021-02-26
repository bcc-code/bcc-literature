import Vue from "vue";
import App from "./app.vue";
import router from "./router/index";
import store from "./store/index";
import keys from 'keys';
import "./registerServiceWorker";
import vClickOutside from 'v-click-outside'
import VueI18n from 'vue-i18n'
import VueAppInsights from 'vue-application-insights'
import english from './localization/en/Literature/app.json'
import norwegian from './localization/no/Literature/app.json'
import dutch from './localization/nl/Literature/app.json'
import german from './localization/de/Literature/app.json'
import french from './localization/fr/Literature/app.json'
import finish from './localization/fi/Literature/app.json'
import "@babel/polyfill";
import "@bcc-it/css-literature";
import VueModal from 'vue-js-modal';
import VueClipboard from 'vue-clipboard2';

Vue.config.productionTip = false;
Vue.use(vClickOutside)
Vue.use(VueI18n)

//Added to create a share modal
Vue.use(VueModal);
Vue.use(VueClipboard);
VueClipboard.config.autoSetContainer = true;

Vue.use(VueAppInsights, {
    id: keys.APP_INSIGHTS,
    router
});

Vue.config.errorHandler = (err) => {
    console.log(err);
    store.dispatch('error/setError', err.stack);
};

const messages ={
    en:english,
    no:norwegian,
    dk: norwegian,
    nl:dutch,
    de:german,
    fr:french,
    fi:finish
}

const i18n = new VueI18n({
    locale: 'en', 
    fallbackLocale: 'en',
    messages, 
});
  
Vue.filter('capitalize', function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
});

new Vue({
    i18n,
    router,
    store,
    render: h => h(App)
}).$mount("#app");
