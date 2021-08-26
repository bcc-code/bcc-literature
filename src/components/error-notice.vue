<template>
    <section v-if="showNotice" class="notice error">
        <h5 v-html="errorMessage"></h5>
        <button type="button" class="close" aria-label="Close" @click="$store.commit('error/showError', false)">
            <span aria-hidden="true">×</span>
        </button>
    </section>
</template>

<script>
import { mapState } from 'vuex';
export default {
    computed: {
        ...mapState('error',{
            message: 'message',
            displayMessage: 'displayMessage',
            failedRequest: 'failedRequest',
            showNotice: 'showNotice'
        }),
        ...mapState('session', {
            userInfo: 'userInfo'
        }),
        errorMessage() {
            var userId = this.userInfo['https://login.bcc.no/claims/personId']
            var mailSubject = 'Literature - Unexpected error'
            var mailBody = `Name: ${this.userInfo.name} (${userId}) \r\n\r\n`
            mailBody += `Failed request: ${this.failedRequest} \r\n\r\n`
            mailBody += `Error message: ${this.message.replace(/'/gi, "")}\r\n\r\n`
            mailBody += 'Additional information: '
            if (this.displayMessage){
                return this.displayMessage;
            }
            return this.$t('app.error').replace("it@bcc.no", "<a href='mailto:it@bcc.no?Subject=" + encodeURIComponent(mailSubject) + "&Body=" + encodeURIComponent(mailBody) + "'>it@bcc.no</a>");
        }
    },
}
</script>

<style scoped>
    .notice {
        left: 16px;
    }
    .notice.error h5 {
        color: #a51919;
    }
    .notice .close {
        position: absolute;
        top: 0;
        right: 0;
        opacity: .3;
        cursor: pointer;
    }
    .notice .close span {
        font-size: 25px;
    }
</style>