<template>
    <section class="subscription active">
        <article>  
            <router-link :to="trimHostname(element.lastPublicationUrl)" class="latest">
                <figure v-bind:style="{ 'background-image': coverImage}"></figure>
                <h6>{{$t('subscription.latest-issue')}}</h6>
                <h4>{{element.lastPublicationTitle}}</h4>
            </router-link>
        </article>
    </section>
</template>

<script>
import SubscriptionApi from 'utils/api/subscriptionApi';
import { GridType } from '@/model/gridType.js'
export default {
    props: {
        element: {
            type: Object,
            required: true
        }
    },
    computed: {
        isSubscribed(){
            return this.element.userIsSubscribed;
        },
        cardHeader(){
            return this.isSubscribed 
                ? this.$t("subscription.your-subscriptions") 
                : this.$t("subscription.subscribe-to");
        },
        subscriptionMessage(){
            return this.isSubscribed 
                ? `${this.$t('subscription.subscribed')}  ${this.element.title}`
                : `${this.element.title} vil bli gjort tilgjengelig gratis om ikke så lenge. Nærmere informasjon kommer snart.`;
        },
        coverImage(){
            return `url(${this.element.coverImageUrl})`;
        }
    },
    methods: {
        trimHostname(url){
            return url != null ? url.replace(/(https?):\/\/([^\/]*)/gi, '') : url;
        }
    }
}
</script>