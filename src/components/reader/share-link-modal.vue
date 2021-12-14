<template>
    <section>
        <modal name="shareUrlModal" :maxWidth="768" :maxHeight="200" adaptive>
            <div style="padding: 25px;">
                <h4>{{$t('share.share-link')}}</h4>
                <span class="close-times" @click="close">&times;</span>
                <br/><br/>
                <input class="share-link" type="text" :value="url" readonly/>
                <button :class="['button-main', 'small', 'copy', this.copyClass]" 
                    v-clipboard:copy="url"
                    v-clipboard:success="() => { this.copyText = $t('share.copy-success'); this.copyClass = 'success' }">
                    {{copyText}}
                </button>
                <section class="social-buttons">
                    <TelegramButton :url="url" :description="message" class="share-button--circle"></TelegramButton>
                    <WhatsAppButton :url="url" class="share-button--circle" v-on:onShare="openWhatsApp"></WhatsAppButton>
                    <FacebookButton :url="url" class="share-button--circle"></FacebookButton>
                </section>
            </div>
        </modal>
    </section>
</template>
<script>
import TelegramButton from "vue-share-buttons/src/components/TelegramButton";
import WhatsAppButton from "vue-share-buttons/src/components/WhatsAppButton";
import FacebookButton from "vue-share-buttons/src/components/FacebookButton";

export default {
    components: {
        TelegramButton,
        WhatsAppButton,
        FacebookButton
    },
    props: {
        url: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        }
    },
    data: function(){
        return {
            copyText: this.$t('share.copy-button'),
            copyClass: ''
        }
    },
    methods: {
        close(){
            this.$modal.hide('shareUrlModal');
            this.copyText = this.$t('share.copy-button');
            this.copyClass = '';
        },
        openWhatsApp() {
            const url = `https://wa.me/?text=${encodeURIComponent(this.$props.url)}`;
            return window.open(url);
        }
    }
}
</script>
<style scoped>
input.share-link {
    display: inline;
}
button.copy {
    border-radius: 2em;
    right: 25px;
    position: absolute;
    margin: 4px;
    min-width: 75px;
}
button.copy.success {
    background: -webkit-gradient(linear, left top, right top, from(#3fd442), to(#5ee267));
    background: linear-gradient(to right, #3fd442 0%, #5ee267 100%);
}
span.close-times {
    right: 30px;
    top: 30px;
    position: absolute;
    font-size: 30px;
    cursor: pointer;
}
section.social-buttons {
    width: 450px;
    margin: 0 auto;
}
@media only screen and (max-width: 768px) {
    section.social-buttons {
        width: 350px;
    }
}
@media only screen and (max-width: 648px) {
    section.social-buttons {
        width: 140px;
    }
}
</style>
<style>
@media only screen and (max-width: 648px) {
    .share-button__text {
        display: none !important;
    }
}
</style>
