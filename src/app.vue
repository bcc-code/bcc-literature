<template>
  <div id="main">
    <router-view id="content" class="main-content" />
    <error-notice></error-notice>
    <app-footer/>
  </div>
</template>

<script>
import { EventBus, Events } from "@/utils/eventBus";
import AppFooter from 'components/layout/app-footer.vue';
import ErrorNotice from 'components/error-notice.vue';
import { mapGetters, mapState } from 'vuex';
export default {
    components: {
        AppFooter,
        ErrorNotice
    }, 
    computed: {
        ...mapState('session', ['nightMode']),
        ...mapGetters('session', ['isStandalone'])
    },
    methods: {
        reset() {
            this.$store.dispatch('articles/base/reset');
            this.$store.dispatch('books/base/reset');
            this.$store.dispatch('authors/base/reset');
            this.$store.dispatch('textToSpeech/reset');
        }
    },
    created() {
        this.$store.dispatch('textToSpeech/reset');
        // var resumeAt = localStorage.getItem('literature-resume-at')
        // if (this.isStandalone && resumeAt) this.$router.replace(resumeAt)
    },
    mounted() {
        EventBus.$on(Events.CONTENT_LANGUAGE_CHANGED, this.reset);
    },
    destroyed() {
        EventBus.$off(Events.CONTENT_LANGUAGE_CHANGED, this.reset);
    },  
    watch: {
        '$route.path': {
            handler: function (val) {
                localStorage.setItem('literature-resume-at', val)
            }
        },
        nightMode: {
            immediate: true,
            handler: function (val) {
                if (val) {
                    document.body.classList.remove('light')
                    document.body.classList.add('dark')
                }
                else {
                    document.body.classList.remove('dark')
                    document.body.classList.add('light')
                }
            }
        }
    }
}
</script>
<style>
/* Fix scrollbar issues */
.sidebar::-webkit-scrollbar {
    width: 0
}
.sidebar::-webkit-scrollbar-track {
    display: none
}
.sidebar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>