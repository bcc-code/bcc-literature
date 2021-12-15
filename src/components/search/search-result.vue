<template>
    <article class="search-result" v-on:click="logClickToAI">
        <router-link :to="getReaderRoute(result.document)">
            <div class="result-article">
                <h4>{{result.document.chapter}}</h4>        
                <p class="small" v-html="highlight"></p>
            </div>
            <div class="result-book">
                <book-card-cover :cover-id="result.document.bookCoverImageId"></book-card-cover>
                <div class="book-details">
                    <h5>{{ result.document.bookName }}</h5>
                    <p class="small">{{ result.document.authorFullName }}  ·  {{format(result.document.publishingDate)}}</p>
                </div>
            </div>
        </router-link>
    </article>  
</template>
<script>
import BookCardCover from 'components/grid/tiles/card-cover';
import { BookType } from '@/model/bookType.js';
import { mapState } from 'vuex';
import { logCustomEvent } from '@/utils/appInsights';

export default {
    props: {
        result: {
            type: Object,
            required: true
        },
        rank: {
            type: Number,
            required: true
        }
    },
    components: {
        BookCardCover
    },
    computed: {
        ...mapState('session', {
            locale: 'appLanguage'
        }),
        ...mapState('search', {
            searchId: 'id',
        }),
        highlight() {
            if (this.result.highlights == null)
                return null;

            var highlight = this.result.highlights.BodyPlain[0];
            const maxLength = 400;

            if (highlight.length > maxLength) {
                var beginning = highlight.slice(0, highlight.indexOf('<span>')).lastIndexOf(".");
                var end = highlight.slice(beginning + maxLength).indexOf(".");

                return highlight.slice(beginning + 1, beginning + maxLength + end + 1);
            }

            return highlight;
        },
        // Gets all the words found by Azure to highlight them in the reader
        wordsToHighlight() {
            var words = this.$parent.computedQueryFields.query.split(' ').filter((w) => w.length > 0);
            // Adding potential new words highlighted by azure with fuzzy search
            if (this.highlight != null) {
                this.highlight.match(new RegExp("<span>[^<]*</span>", 'gi')).forEach((word) => {
                    var newWord = word.replace(new RegExp("(<span>|</span>)", 'g'), "")
                    if (words.indexOf(newWord) == -1)
                        words.push(newWord);
                });
            }
            return words;
        }
    },
    methods: {
        // I would move this into e.g. a "routerHelper" mixin if it will be reused more
        getReaderRoute(document) {
            switch(document.bookTypeId) {
            case BookType.BLAD:
                return {  
                    name: 'read-publication',
                    params: { 
                        bookId: document.bookId, 
                        year: document.publishingYear, 
                        month: document.publishingMonth,
                        chapterId: document.chapterSequence,
                        highlight: this.wordsToHighlight,
                        parent: this.$route
                    }
                }
            default: 
                return {  
                    name: 'read',
                    params: { 
                        bookId: document.bookId, 
                        chapterId: document.chapterSequence,
                        highlight: this.wordsToHighlight,
                        parent: this.$route
                    }
                }
            }
        },
        
        format(publishingDate) {
            var date = new Date(publishingDate);
            if (date.getFullYear() == 1) return '';
            return date.toLocaleDateString((this.locale == 'no' ? 'nb' : this.locale), { month: 'long', year: 'numeric' });
        },

        logClickToAI() {
            logCustomEvent("ClickSearchResult", {
                SearchServiceName: "searchopenportal",
                SearchId: this.searchId,
                ClickedDocId: this.result.document.articleId,
                Rank: this.rank
            });
        }
    },
};
</script>