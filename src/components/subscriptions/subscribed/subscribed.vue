<template>
    <section>
        <section class="subscription-info">
            <section v-if="subscribed">
                <h4>{{$t('subscription.subscribed')}} {{book.title}}</h4>
                <a class="button-secondary small" v-on:click="showConfirmation = true">{{$t('subscription.unsubscribe.button')}}</a>
            </section>
            <section v-else>
                <h4>{{$t('subscription.unsubscribed')}}</h4>
            </section>
        </section>
        <UnsubscribeConfirmation v-if="showConfirmation" :book-id="book.id" :book-name="book.title" @close="showConfirmation = false" @unsubscribed="subscribed = false"/>
    </section>
</template>

<script>
import UnsubscribeConfirmation from './unsubscribe-confirmation';

export default {
    components: {
        UnsubscribeConfirmation
    },
    props: {
        book: {
            type: Object,
            required: true
        }
    },
    data: function(){
        return {
            subscribed: true,
            showConfirmation: false
        }
    },
}
</script>
