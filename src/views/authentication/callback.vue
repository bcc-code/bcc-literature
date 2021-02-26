<template>
  <LoadingSpinner />
</template>

<script>
import store from 'store';
import Oidc from 'oidc-client';
import LoadingSpinner from 'components/loading-spinner';
import loadjs from "loadjs";

export default {
    components: {
        LoadingSpinner
    },
    methods: {
        async registerSignOutUrl () {
            return new Promise((resolve, reject) => {
                loadjs("https://auth.bcc.no/signout/js", {
                    async: false,
                    error: function (path) {
                        return reject(null);
                    },
                    success: function () {
                        return resolve();
                    },
                    before: function (path, element) {
                        /* called before being embedded */
                        element.setAttribute("signout-path", "/signout");

                        document.body.appendChild(element);
                        return false;  //bypass default DOM insertion, because the script has to be inserted into the body
                    }
                });

            });
        }
    },

    async created () {
        const mgr = new Oidc.UserManager(
            {
                userStore: new Oidc.WebStorageStateStore({ store: window.localStorage }),
                loadUserInfo: true,
                filterProtocolClaims: true,
            });

        await this.registerSignOutUrl()
            .catch(function (err) {
                console.error('could not register signout path');
            });

        const self = this;
        mgr.signinRedirectCallback().then(function (user) {
            let returnToUrl = (user.state !== undefined) ? user.state : '/';
            store.commit('session/setAuthenticated', true);
            store.commit('session/setUserInfo', user.profile);
            self.$i18n.locale = store.state.session.appLanguage;
            self.$router.push({ path: returnToUrl });
        }).catch(function (err) {
            // TODO: Create an unprotected unauthorized page
            self.$router.push({ name: 'Unauthorized' });
        });
    },
}
</script>
