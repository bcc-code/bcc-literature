<template>
    <section>
        <section class="sidebar">
            <div class="section-header">
                <h5>{{$t('book-index.chapters')}} <span>{{chaptersLength}}</span>
                    <a v-if="chaptersLength != 0" class="share-icon" @click="openShareModal()"></a>
                </h5>
            </div>
            <section class="list">
                <ol class="chapters">
                    <li v-for="chapter in chapters.sort((a, b) => parseInt(a.id) - parseInt(b.id))" 
                        :key="chapter.id"
                        :class="['chapter', { 'current-chapter': chapter.id == selectedChapter }]" 
                        @click="$emit('chapterChanged', chapter.id)">
                        <a v-bind:alt="chapter.title"><h5>{{chapter.title}}</h5></a>
                    </li>
                </ol>
            </section>
        </section>
        <section class="overlay" />
        <ShareLinkModal v-show="showShareModal" :url="shareUrl" :message="shareMessage"></ShareLinkModal>
    </section>
</template>

<script>
import Vue from 'vue'
import { BookType } from '@/model/bookType.js'
import BookMixins from '@/mixins/book'
import BaseApi from '@/utils/api/baseApi.js';
import ShareLinkModal from './share-link-modal.vue';

export default {
    data () {
        return {
            showShareModal : false
        }
    },
    components : {
        ShareLinkModal
    },
    mixins: [BookMixins],
    computed: {
        chaptersLength(){
            if (this.chapters == null)
                return 0;
            return this.chapters.length;
        },
        selectedChapter(){
            return this.$route.params.chapterId
        },
        selectedChapterTitle(){
            if (this.chapters.some(el => el.id == this.selectedChapter))
                return this.chapters.find(el => el.id == this.selectedChapter).title
            return ''
        },
        shareUrl(){
            return BaseApi.addLanguageQuery(window.location.origin + this.$route.fullPath);
        },
        shareMessage(){
            return this.$t('share.message', { chapterName: this.selectedChapterTitle });
        }
    },
    methods: {
        openShareModal(){
            if (navigator.share) {
                navigator.share({
                    title: this.selectedChapterTitle,
                    text: this.shareMessage,
                    url: this.shareUrl
                });
            }
            else {
                this.showShareModal = true;
            }
        }
    },
    watch: {
        showShareModal: function(newValue) {
            if (newValue) 
                this.$modal.show('shareUrlModal');
            else
                this.$modal.hide('shareUrlModal');
        }
    }
}
</script>
<style scoped>
/* Temporary style */
.chapters .chapter a {
    cursor: pointer;
}

.share-icon {
    position: absolute;
    top: 10px;
    right: 40px;
    width:20px;
    height: 20px;
    cursor: pointer;
    background: url(/img/icon_24_share.svg) center center no-repeat;
    background: url(/img/icon_24_share.svg) center center no-repeat;
}

@media only screen and (max-width: 648px) {
    .share-icon {
        top: 13px;
        right: 20px;
    }
}
</style>