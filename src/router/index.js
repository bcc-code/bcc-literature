import Vue from 'vue';
import VueRouter from 'vue-router';
import { routes } from './routes';
import scrollBehavior from './scrollBehavior';
import authenticator from 'utils/auth';
import { logPageView } from '@/utils/appInsights';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    scrollBehavior,
    routes,
});

router.beforeEach(async (to, from, next) => {
    if (to.query.lang != null) {
        router.app.$store.commit('session/setAppLanguage', to.query.lang);
    }
    if (!(router.app.$store.state.session.isAuthenticated || to.meta.unprotected)) {
        await authenticator.getUser().then((user) => {
            router.app.$store.commit('session/setAuthenticated', true);
            router.app.$store.dispatch('session/updateUserInfo', user.profile);
            router.app.$i18n.locale = router.app.$store.state.session.appLanguage;
        });
    }
    next();
});

router.afterEach(route => {
    logPageView(route.name, {});
});

export default router;