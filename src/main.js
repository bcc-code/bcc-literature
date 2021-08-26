import Vue from 'vue';
import App from './app.vue';
import router from './router/index';
import keys from 'keys';
import store from './store/index';
import './registerServiceWorker';
import vClickOutside from 'v-click-outside';
import VueI18n from 'vue-i18n';
import english from './localization/en.json';
import norwegian from './localization/no.json';
import dutch from './localization/nl.json';
import german from './localization/de.json';
import french from './localization/fr.json';
import finnish from './localization/fi.json';
import romanian from './localization/ro.json';
import '@babel/polyfill';
import '@/assets/style.css';
import VueModal from 'vue-js-modal';
import VueClipboard from 'vue-clipboard2';
import VueAppInsights from 'vue-application-insights';

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

const messages = {
    en: english,
    no: norwegian,
    dk: norwegian,
    nl: dutch,
    de: german,
    fr: french,
    fi: finnish,
    ro: romanian
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
