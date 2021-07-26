/* eslint-disable prefer-rest-params */
/* This class is based on this library example : https://github.com/joaojosefilho/vuejsOidcClient */
import Oidc from 'oidc-client';
import keys from 'keys';

const Authenticator = new Oidc.UserManager({
    userStore: new Oidc.WebStorageStateStore({store: window.localStorage}),
    authority: keys.AUTH0_DOMAIN,
    client_id: keys.AUTH0_CLIENT_ID,
    redirect_uri: window.location.origin + '/callback',
    silent_redirect_uri: window.location.origin + '/silent-renew',
    response_type: 'id_token token',
    scope: 'openid profile email church',
    post_logout_redirect_uri: window.location.origin,
    extraQueryParams: {'audience': keys.API_AUDIENCE},
    metadata: {
        issuer: keys.AUTH0_DOMAIN + '/',
        authorization_endpoint: keys.AUTH0_DOMAIN + '/authorize',
        userinfo_endpoint: keys.AUTH0_DOMAIN + '/userinfo',
        end_session_endpoint: keys.AUTH0_DOMAIN + '/v2/logout',
        jwks_uri: keys.AUTH0_DOMAIN + '/.well-known/jwks.json',
    },
    accessTokenExpiringNotificationTime: 10,
    automaticSilentRenew: true,
    filterProtocolClaims: true,
    loadUserInfo: true,
});

Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.WARN;

/* Raised when the automatic silent renew has failed. */
Authenticator.events.addSilentRenewError(function() {
    console.error('Silent Renew Error：', arguments);
    authenticator.signIn();
});

/* Raised when the user's sign-in status at the OP (OpenID Provider) has changed. */
Authenticator.events.addUserSignedOut(function() {
    console.log('UserSignedOut：', arguments);
    authenticator.signOut();
});

/**
 * This class manages the authentication in our SPA
 */
class SecurityService {
    /**
     * Renew the token manually.
     * @return {Promise}
     */
    renewToken() {
        const self = this;
        return new Promise((resolve, reject) => {
            Authenticator.signinSilent().then(function(user) {
                if (user == null) {
                    self.signIn();
                    return reject(null);
                } else {
                    return resolve(user);
                }
            }).catch(function(err) {
                console.log(err);
                self.signIn();
                return reject(null);
            });
        });
    }

    /**
     * Get the user who is logged in
     * @return {Promise} The logged-in user
     */
    getUser() {
        const self = this;
        return new Promise((resolve, reject) => {
            Authenticator.getUser().then(function(user) {
                if (user == null) {
                    self.signIn();
                    return reject(null);
                } else {
                    return resolve(user);
                }
            }).catch(function(err) {
                console.log(err);
                return reject(err);
            });
        });
    }

    /**
     * Redirect of the current window to the authorization endpoint.
     */
    signIn() {
        Authenticator.signinRedirect({state:window.location.pathname+window.location.search}).catch(function(err) {
            console.log(err);
        });
    }

    /**
     * Redirect of the current window to the end session endpoint
     */
    signOut() {
        Authenticator.signoutRedirect().then(function(resp) {
            console.log('Signed out', resp);
        }).catch(function(err) {
            console.log(err);
        });
    }

    /**
     * Get the token id
     * @return {Promise}
     */
    getIdToken() {
        const self = this;
        return new Promise((resolve, reject) => {
            Authenticator.getUser().then(function(user) {
                if (user == null) {
                    self.signIn();
                    return reject(null);
                } else {
                    return resolve(user.id_token);
                }
            }).catch(function(err) {
                console.log(err);
                return reject(err);
            });
        });
    }

    /**
     * Get the access token of the logged in user
     * @return {Promise}
     */
    getAccessToken() {
        const self = this;
        return new Promise((resolve, reject) => {
            Authenticator.getUser().then(function(user) {
                if (user == null) {
                    self.signIn();
                    return reject(null);
                } 
                else if (user.expired) {
                    self.renewToken().then((renewedUser) => {
                        return resolve(renewedUser.access_token);
                    }).catch((err) => {
                        return reject(err);
                    });
                }
                else {
                    return resolve(user.access_token);
                }
            }).catch(function(err) {
                console.log(err);
                return reject(err);
            });
        });
    }


    /**
     * CUSTOM METHODS : PLEASE CHECK THE LIBRARY DOCUMENTATION BEFORE ADDING A NEW CUSTOM METHOD
     */

    /**
     * Handle error related to authentication
     */
    async handleError() {
        const self = this;
        await this.renewToken().then(async () => {
            window.location.reload();
        }).catch((error) => {
            console.log(error);
        });
    }
}

const authenticator = new SecurityService();
export default authenticator;