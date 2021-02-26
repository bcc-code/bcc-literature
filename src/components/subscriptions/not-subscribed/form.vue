<template>
    <form>
        <section v-if="hasFreeOption">
            <FreeOptionText />
            <div class="checkbox-input">
                <input type="checkbox" v-model="freeOption">
                <label>{{$t('subscription.form.freeOption', {publicationName: this.formData.bookName})}}</label>
            </div>
        </section>
        <h5 v-else>{{$t('subscription.form.title')}}</h5>
        <section id="payerInformation">
            <label>{{$t('subscription.form.name')}}</label>
            <input type="text" v-model="form.payerName">
            <label>{{$t('subscription.form.email')}}</label>
            <input type="text" v-model="form.payerEmail">
            <label>{{$t('subscription.form.address')}}</label>
            <input type="text" v-model="form.payerAddress">
            <label>{{$t('subscription.form.city')}}</label>
            <input type="text" v-model="form.payerCity">
            <label>{{$t('subscription.form.postalCode')}}</label>
            <input type="text" v-model="form.payerPostalCode">
            <label>{{$t('subscription.form.state')}}</label>
            <input type="text" v-model="form.payerState">
            <label>{{$t('subscription.form.country')}}</label>
            <input type="text" v-model="form.payerCountry">
        </section>
        <section id="giftSection" v-if="formData.hasMultiModes && !freeOption">
            <div class="checkbox-input">
                <input type="checkbox" v-model="form.giftOption">
                <label>{{$t('subscription.form.giftOption')}}</label>
            </div>
            <section id="receiverInformation" v-if="form.giftOption">
                <label>{{$t('subscription.form.name')}}</label>
                <input type="text" v-model="form.receiverName">
                <label>{{$t('subscription.form.address')}}</label>
                <input type="text" v-model="form.receiverAddress">
                <label>{{$t('subscription.form.city')}}</label>
                <input type="text" v-model="form.receiverCity">
                <label>{{$t('subscription.form.postalCode')}}</label>
                <input type="text" v-model="form.receiverPostalCode">
                <label>{{$t('subscription.form.state')}}</label>
                <input type="text" v-model="form.receiverState">
                <label>{{$t('subscription.form.country')}}</label>
                <input type="text" v-model="form.receiverCountry">
            </section>
        </section>
        <label>{{$t('subscription.form.price')}}</label>
        <input type="text" v-model="form.price" :readonly="true">
        <button class="button-main small" :disabled="!formCompleted" v-on:click="subscribe">
            {{$t('subscription.subscribe-button')}}
        </button>
    </form>
</template>

<script>
import SubscriptionApi from 'utils/api/subscriptionApi';
import { mapState } from 'vuex';
import FreeOptionText from './freeOptionText.vue';

export default {
    props: {
        formData : {
            type: Object,
            required: true
        }
    },
    components: {
        FreeOptionText
    },
    data: function(){
        return {
            form: {
                payerName: null,
                payerEmail: null,
                payerAddress: null,
                payerCity: null,
                payerPostalCode: null,
                payerState: null,
                payerCountry: null,
                receiverName: null,
                receiverAddress: null,
                receiverCity: null,
                receiverPostalCode: null,
                receiverState: null,
                receiverCountry: null,
                price: null,
                giftOption: false
            },
            freeOption: false,
        }
    },
    created(){
        this.form.payerName = this.userInfo.name;
        this.form.payerEmail = this.userInfo.email;
        this.form.price = this.formattedPrice;
    },
    computed: {
        ...mapState('session', {
            userInfo: 'userInfo',
        }),
        formCompleted(){
            var hasData = (el) => { return Boolean(el)};
            if (this.form.giftOption)
                return Object.keys(this.form).every((el) => { return hasData(this.form[el])});
            else
                return Object.keys(this.form).every((el) => { return el.indexOf('receiver') > -1 || el.indexOf('gift') > -1 || hasData(this.form[el])});
        },        
        getAge(){
            var yearOfBirth = new Date(this.userInfo.birthdate).getFullYear();
            var currentYear = new Date().getFullYear();
            var yearDiff = currentYear - yearOfBirth;
            return yearDiff;
        },
        hasFreeOption(){
            return this.formData.bookId == '1' && this.getAge == '20';
        },
        formattedPrice(){
            return this.$t('subscription.price-per-year', {price: this.discountPrice})
        },
        discountPrice(){
            /* Gets discount for germans under 24 yo */
            if (this.formData.bookId == 8 && this.getAge < 24)
                return '40 EUR';
            return this.formData.bookPrice;
        }
    },
    watch: {
        freeOption: function (val) {
            this.form.price = val ? this.$t('subscription.form.free') : this.formattedPrice;
        },
    },
    methods: {
        async subscribe(event){
            event.preventDefault();
            if (this.formCompleted)
            {
                await SubscriptionApi.subscribeTo(this.formData.bookId, this.form).then((result) => {
                    this.$emit('subscribe', result.data);                
                });
            }
        },
    }
}
</script>

<style scoped>
/* This style is only temporary : will have to be replaced once Søren is done designing it*/
.checkbox-input{
    display: inline-block;
}

input[type=checkbox] {
    display: inherit;
    vertical-align: middle;
    width: 20px;
    height: 20px;
    padding: 0;
    margin-top: -3px;
    margin-right: 10px;
    -webkit-appearance:checkbox;
    -moz-appearance: checkbox;
    appearance: checkbox;
}

input[type=checkbox] + label{
    display: inherit;
}



</style>