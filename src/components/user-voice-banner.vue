<template>
    <section class="center user-voice-banner">
        <a href="#" class="user-voice-illustration" target="_blank" @click="goToUserVoice"><img src="/img/user-voice-illustration.svg" alt="User Voice"></a>
        <div class="content">
            <h4>{{ $t('app.user-voice.title') }}</h4>
            <p>{{ $t('app.user-voice.description') }}</p>
            <button class="button-main small" @click="goToUserVoice">{{$t('app.user-voice.button')}}</button>
        </div>
    </section>
</template>

<script>
import { logCustomEvent } from '@/utils/appInsights';
export default {
    methods: {
        goToUserVoice: function(event) {
            event.preventDefault();
            logCustomEvent("GoToUserVoice", {});
            window.open("https://uservoice.bcc.no/?tags=literature", '_blank');
        }
    }
}
</script>

<style scoped>
.user-voice-banner {
    border-radius: 8px;
    margin-top: 20px;
    border: 2px solid #e6e9f2;
    display: flex;
    margin-left: 11px;
    overflow: hidden;
}
.user-voice-illustration {
    background-color: rgba(98, 145, 235, 0.2);
    display: flex;
    flex: 0 0 120px;
    justify-content: center;
}
.user-voice-illustration img {
    max-width: 70px;
}
.user-voice-banner .content {
    padding: 20px 24px;
}
.user-voice-banner p {
    margin: 7px 0 14px;
    color: #838CA8;
    line-height: 1.6em;
}
.user-voice-banner button {
    margin: 0;
}

@media only screen and (max-width: 1049px) {
    .user-voice-banner {
        margin-left: 0;
    }
    .user-voice-illustration {
        width: 80px;
        flex: 0 0 80px;
    }
    .user-voice-illustration img {
        max-width: 50px;
    }
    .user-voice-banner .content {
        padding: 16px;
    }
}

@media only screen and (max-width: 648px) {
    .user-voice-banner h4 {
        margin-bottom: 10px;
    }
    .user-voice-banner p {
        display: none;
    }
}
</style>