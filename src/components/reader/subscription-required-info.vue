<template>
    <section class="subscription-required">
        <div class="container">
            <h3>{{$t('reader.subscription-required')}}</h3>
        </div>
        <Subscription :book="book"/> 
    </section>
</template>

<script>
import Subscription from 'components/subscriptions';
export default {
    components: {
        Subscription
    },
    props: {
        book: {
            type: Object,
            required: true
        }
    }
}
</script>
<style scoped>
/* This style is only temporary */
.subscription-required {
    padding: 5% 0;
}
</style>