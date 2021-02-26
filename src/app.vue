<template>
  <div id="main" :style="{marginTop: topbarInitialized ? '0' : '48px' }">
    <router-view id="content" class="main-content" />
    <error-notice></error-notice>
    <app-footer/>
  </div>
</template>

<script>
import { EventBus, Events } from "@/utils/eventBus";
import AppFooter from 'components/layout/app-footer.vue';
import ErrorNotice from 'components/error-notice.vue';
import { mapState } from 'vuex';
export default {
    components: {
        AppFooter,
        ErrorNotice
    }, 
    computed: {
        ...mapState('session', ['topbarInitialized'])
    },
    methods: {
        reset() {
            this.$store.dispatch('articles/base/reset');
            this.$store.dispatch('books/base/reset');
            this.$store.dispatch('authors/base/reset');
        }
    },
    mounted() {
        EventBus.$on(Events.CONTENT_LANGUAGE_CHANGED, this.reset);
    },
    destroyed() {
        EventBus.$off(Events.CONTENT_LANGUAGE_CHANGED, this.reset);
    },  
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