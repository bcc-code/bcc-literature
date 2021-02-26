<template>
    <h1>Signing out...</h1>
</template>

<script>
import store from 'store';
import authenticator from 'utils/auth';
import loadjs from "loadjs";

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
};
</script>
