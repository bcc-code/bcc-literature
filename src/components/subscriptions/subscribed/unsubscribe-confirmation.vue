<template>
    <section class="overlay">
        <section class="overlay--dialog">
            <section v-if="!errorWhenUnsubscribing">
                <h4>{{$t('subscription.unsubscribe.confirmation-header')}}</h4>
                <p class="small">{{$t('subscription.unsubscribe.confirmation-body', {publicationName: bookName})}}</p>
            </section>
            <section v-else>
                <h4>{{$t('subscription.unsubscribe-failed.title')}}</h4>
                <p class="small" v-html="$t('subscription.unsubscribe-failed.body')"></p>
            </section>
            <a class="button-secondary small" v-on:click="close">{{$t('subscription.unsubscribe.cancel')}}</a>
            <a class="button-main small" v-on:click="unsubscribe">{{$t('subscription.unsubscribe.button')}}</a>
        </section>
    </section>
</template>

<script>
import SubscriptionApi from 'utils/api/subscriptionApi';
import { mapState } from 'vuex';

export default {
    props: {
        bookId: {
            type: Number,
            required: true
        },
        bookName: {
            type: String,
            required: true
        }
    },
    data: function(){
        return {
            errorWhenUnsubscribing: false,
        }
    },
    computed: {
        ...mapState('session', {
            userInfo: 'userInfo'
        })
    },
    methods: {
        close(){
            this.$emit('close');
        },
        async unsubscribe(){
            var userInformation = { name: this.userInfo.name, email: this.userInfo.email };
            await SubscriptionApi.unsubscribeTo(this.bookId, userInformation).then((result) => {
                if (!result.data)
                    this.errorWhenUnsubscribing = true;
                else {
                    this.$emit('unsubscribed');
                    this.close();     
                }           
            });
        }
    }
}
</script>
