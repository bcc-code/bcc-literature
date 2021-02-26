<template>
    <section class="subscription" :class="{active : isSubscribed}">
        <h5>{{cardHeader}}</h5>
        <h4>{{element.title}}</h4>
        <p class="small">{{subscriptionMessage}}</p>
        <article v-if="isSubscribed">  
            <router-link :to="trimHostname(element.publicationUrl)" class="button-secondary small">{{$t('subscription.see-all')}}</router-link>
            <router-link :to="trimHostname(element.lastPublicationUrl)" class="latest">
                <figure v-bind:style="{ 'background-image': coverImage}"></figure>
                <h6>{{$t('subscription.latest-issue')}}</h6>
                <h4>{{element.lastPublicationTitle}}</h4>
            </router-link>
        </article>
        <article v-else>  
            <figure v-bind:style="{ 'background-image': coverImage}"></figure>
            <div class="signup-cta">
                <router-link :to="trimHostname(element.publicationUrl)" class="button-main small">{{$t('subscription.learn-more')}}</router-link>
            </div>
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
                : this.$t('subscription.subtitle', {publicationName : this.element.title});
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