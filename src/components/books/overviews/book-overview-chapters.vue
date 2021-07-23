<template>
  <div v-if="book != null">
    <section v-bind:class="{'ebook-only' : book.ebookOnly}" class="book-header container">
        <section class="flex sm-flex-col center small">
            <book-card-cover :cover-id="book.coverId"></book-card-cover>
            <section class="flex flex-col justify-center info" :class="{ 'tall': bookId == 39 }">
                <h2>{{book.title}}</h2>
                <h5>
                    <template v-if="book.author">
                        {{$t('book-index.written-by')}} {{book.author.fullName}}
                    </template>
                    <template v-if="book.author && book.year">
                            ·  
                    </template>
                    <template v-if="book.year">
                        {{book.year}}
                    </template>
                </h5>

                <section class="actions">
                    <a v-if="book.ebookId != null" @click="getEbook"
                        v-bind:class="[book.ebookOnly ? 'button-main' : 'button-secondary', 'small']">{{$t('book-index.get-ebook')}}</a>
                    <a v-if="!book.ebookOnly" class="button-main small" @click="startReadingFirstChapter">{{$t('book-index.read-now')}}</a>
                    <a v-if="bookId == 39" class="button-main small" @click="startReadingRandomChapter">{{$t('book-index.read-random-chapters')}}</a>
                </section>
            </section>
        </section>
    </section>

    <loading-spinner v-if="loadingChapters"/>
    <section class="container" v-else-if="!book.ebookOnly">
        <section class="center small">
            <div class="section-header">
                <h5>{{$t('book-index.chapters')}} <span>{{chapters.length}}</span></h5>
            </div>
            <book-chapters-list :chapters="chapters"/>
        </section>
    </section>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import BookChaptersList from 'components/books/book-chapters-list';
import BookCardCover from 'components/grid/tiles/card-cover';
import LoadingSpinner from 'components/loading-spinner';
import BaseApi from 'utils/api/baseApi';
import BookMixins from '@/mixins/book';
import { logCustomEvent } from '@/utils/appInsights';

export default {
    components: {        
        BookChaptersList,
        BookCardCover,
        LoadingSpinner
    },
    data() {
        return {
            loadingChapters: false,
            randomChapterId: null
        }
    },
    mixins: [BookMixins],
    created() {
        this.setRandomChapterId();
        if (!this.book.ebookOnly) {
            this.loadingChapters = true;
            this.loadChapters(this.bookId).then(() => {
                this.loadingChapters = false;
            })
        }
    },
    methods: {
        setRandomChapterId() {
            var min = 3, max = 284;
            var randomNum = Math.floor(Math.random() * (max - min) + min);
            this.randomChapterId = randomNum + "";
        },
        getEbook: async function() {
            logCustomEvent("DownloadEbook", {
                EbookId: this.book.ebookId,
                Language: this.book.language,
                BookTitle: this.book.title
            });

            await BaseApi.getDownloadEbookLink("blobs/ebook/" + [this.book.ebookId, this.book.language, this.book.title].join('_'))
                .then((downloadLink) => {
                    window.open(downloadLink, "_blank");
                });
        },
        startReadingFirstChapter: function() {
            logCustomEvent("StartFirstChapter", {
                ChapterId: '1',
                Language: this.book.language,
                BookTitle: this.book.title
            });
            this.$router.push({
                name: 'read',
                params: { chapterId: 1 }
            });
        },
        startReadingRandomChapter: function() {
            logCustomEvent("ReadRandomChapter", {
                ChapterId: this.randomChapterId,
                Language: this.book.language,
                BookTitle: this.book.title
            });
            this.$router.push({
                name: 'read',
                params: { chapterId: this.randomChapterId }
            });
        },
        ...mapActions('books', {
            loadChapters: 'loadChapters'
        }),
    }
};
</script>