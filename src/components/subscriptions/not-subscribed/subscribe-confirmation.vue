<template>
    <div class="subscription-confirmation">
        <p :class="Class"></p>
        <h4>{{Title}}</h4>
        <p v-html="Body"/>
    </div>
</template>

<script>
export default {
    props: {
        success: {
            type: Boolean,
            required: true
        }
    },
    computed: {
        Class(){
            return this.success ? "success" : "error";
        },
        Title(){
            return this.success ? this.$t('subscription.subscribe-success.title') : this.$t('subscription.subscribe-failed.title');
        },
        Body(){
            return this.success ? this.$t('subscription.subscribe-success.body') : this.$t('subscription.subscribe-failed.body');
        }
    }
}
</script>
<style scoped>
/*Temporary style*/
.subscription-confirmation .success {
    height: 24px;
    background: url(/img/icon_checkmark_blue.svg) center center no-repeat;
}

.subscription-confirmation .error {
    height: 24px;  
    background: url(/img/icon_24_close-red.svg) center center no-repeat;
}
</style>