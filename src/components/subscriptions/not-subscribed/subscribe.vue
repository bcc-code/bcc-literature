<template>
    <section v-bind:class="['subscription-signup', {'open': showForm}, {'confirmed': showConfirmation}]">
        <h4>{{$t("subscription.subscribe-to")}} {{book.title}}</h4>
        <p class="small">{{$t("subscription.subtitle", {publicationName: book.title})}}</p>
        <BookCover :cover-id="book.coverId"></BookCover>
        <a v-if="showForm" class="button-circular minimize-button small" v-on:click="showForm = false"></a>
        <SubscriptionForm v-if="showForm" :formData="subscriptionInfo" @subscribe="subscribe"/>
        <Confirmation v-if="showConfirmation" :success="success"/>
        <div class="signup-cta" v-if="!showForm && !showConfirmation">
            <a class="button-main small" v-on:click="showFormOrGoToPublication">{{$t('subscription.subscribe-button')}}</a>
        </div>
    </section>
</template>

<script>
import SubscriptionForm from './form';
import Confirmation from './subscribe-confirmation';
import BookCover from 'components/grid/tiles/card-cover';
import { mapState } from 'vuex';
import keys from 'keys';

export default {
    components: {
        SubscriptionForm,
        Confirmation,
        BookCover
    },
    props: {
        book: {
            type: Object,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        hasMultiModes: {
            type: Boolean,
            required: true
        }
    },
    data: function() {
        return {
            showForm: false,
            showConfirmation: false,
            success: false,
            mode: "normal"
        }
    },
    methods: {
        subscribe(payload) {
            this.showForm = false;
            this.showConfirmation = true;
            this.success = payload;
        },
        showFormOrGoToPublication() {
            if (this.book.id in keys.SUBSCRIPTION_FORM_URLS) {
                window.open(
                    keys.SUBSCRIPTION_FORM_URLS[this.book.id],
                    '_blank'
                );
            }
            else {
                this.showForm = true;
                this.mode = 'normal';
            }
        }
    },
    computed: {
        ...mapState('session', {
            userInfo: 'userInfo'
        }),
        subscriptionInfo() {
            return { 
                "hasMultiModes": this.hasMultiModes,
                "bookId": this.book.id,
                "bookName": this.book.title,
                "bookPrice": this.price
            };
        }
    }
}
</script>
