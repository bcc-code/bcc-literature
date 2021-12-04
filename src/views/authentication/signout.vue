<template>
    <h1>Signing out...</h1>
</template>

<script>
import store from 'store';
import authenticator from 'utils/auth';
import loadjs from "loadjs";
import DefaultMetaHeaderMixins from "@/mixins/default-meta-header";

export default {
    async created() {
        loadjs("https://widgets.bcc.no/widgets/signoutjs", {
            async: false,
            error: function (path) {
                console.error('could not load resource: ' + path);
                authenticator.signOut();

            },
            success: function() { 
                authenticator.signOut();
            },
        });
    },
    mixins: [DefaultMetaHeaderMixins],
};
</script>
