<template>
    <section class="container" v-if="isPaidSubscription && subscriptionLoaded && !isSubscribed">
		<section class="center small">
            <SubscriptionForm :book="book" :price="price" :hasMultiModes="hasMultiModes"/>
		</section>
	</section>
</template>
<script>
import SubscriptionForm from './not-subscribed/subscribe.vue';
import { mapState, mapActions } from 'vuex';

export default {
    components: {
        SubscriptionForm,
    },
    props: {
        book: {
            type: Object,
            required: true
        },
    },
    data: function(){
        return {
            subscriptionLoaded: false
        }
    },
    computed: {
        ...mapState('publications', {
            isPaidSubscription: 'isPaidSubscription',
            isSubscribed: 'isSubscribed',
            hasMultiModes: 'hasMultiModes',
            price: 'price',
        })
    },
    methods: {
        ...mapActions('publications', {
            loadInformation: 'loadInformation',
            getIsSubscribed: 'getIsSubscribed'
        })
    },
    async created(){
        await this.loadInformation(this.book.id).then( async () => {
            if (this.isPaidSubscription){
                await this.getIsSubscribed(this.book.id).then( () => {
                    this.subscriptionLoaded = true;
                })
            }
        });
    }
}
</script>
