<template>
  <div>
        <loading-spinner v-if="loadingTop" :id="'scrollerTop'"/>
        <!-- Todo: Transition group -->
        <slot/>
        <loading-spinner v-if="loadingBottom"/>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { EventBus, Events } from '@/utils/eventBus';
import LoadingSpinner from 'components/loading-spinner';

export default {
    components: {
        LoadingSpinner,
    },
    props: {'articles': {}, 'loadTopHandler': {}, 'loadBottomHandler': {}, 'getElementName': {}, 'noLazyLoad': Boolean},
    data() {
        return {
            loadingTop: false,
            loadingBottom: false,
            lastScrollTop: 0,
        }
    },
    computed: {
        loading() {
            return this.loadingTop || this.loadingBottom;
        },
        currentChapterId(){
            return this.$route.params.chapterId;
        }
    },
    mounted() {
        this.addScrollHandler();
    },
    beforeDestroy() {
        this.removeScrollHandler();
    },
    methods: {
        addScrollHandler() {
            Vue.nextTick(() => {
                window.addEventListener('scroll', this.scrollHandler);
            });
        },
        removeScrollHandler() {
            window.removeEventListener('scroll', this.scrollHandler);
        },
        scrollHandler(event) {
            if (this.loading) {
                return;
            }
            // https://stackoverflow.com/questions/28633221/document-body-scrolltop-firefox-returns-0-only-js
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            let halfScreen = window.innerHeight / 2;
            let hitBottomOfWindow = scrollTop + window.innerHeight >= document.documentElement.offsetHeight-2;
            let hitTop = scrollTop == 0;
            this.lastScrollTop = scrollTop;
            
            for(let i = 0; i < this.articles.length; i++) {
                let article = this.articles[i];
                let element = document.querySelector('#'+this.getElementName(article));
                let elementRect = element.getBoundingClientRect();
                // If article is in the top half of screen and has changed
                if (elementRect.top < halfScreen && elementRect.bottom > halfScreen && article.chapterId != this.currentChapterId) {
                    this.$emit('change', article);
                    break; // This break is important in case two articles are in the top half of screen
                }
            }
            
            if(!this.noLazyLoad) {
                if (hitTop && this.loadTopHandler != null) {
                    this.loadingTop = true;
                    this.loadTopHandler().then(() => {
                        this.loadingTop = false;
                    }).catch(() => {
                        this.loadingTop = false;
                    });
                }
                if (hitBottomOfWindow && this.loadBottomHandler != null) {
                    this.loadingBottom = true;
                    this.loadBottomHandler().then(() => {
                        this.loadingBottom = false;
                    }).catch(() => {
                        this.loadingBottom = false;
                    });
                }
            }
        },
    }
};
</script>
<style>
#scrollerTop #loader{
    margin: 0 auto;
}
</style>