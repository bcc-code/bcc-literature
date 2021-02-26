<template>
    <LoadingSpinner />
</template>

<script>
import store from 'store';
import authenticator from 'utils/auth';
import Oidc from 'oidc-client';
import LoadingSpinner from 'components/loading-spinner';

export default {
    components: {
        LoadingSpinner
    },
    async created() {
        new Oidc.UserManager().signinSilentCallback();
    },
};
</script>
