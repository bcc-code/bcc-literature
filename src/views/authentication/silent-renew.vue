<template>
    <LoadingSpinner />
</template>

<script>
import store from 'store';
import authenticator from 'utils/auth';
import Oidc from 'oidc-client';
import LoadingSpinner from 'components/loading-spinner';
import DefaultMetaHeaderMixins from "@/mixins/default-meta-header";

export default {
    components: {
        LoadingSpinner
    },
    mixins: [DefaultMetaHeaderMixins],
    async created() {
        new Oidc.UserManager().signinSilentCallback();
    },
};
</script>
