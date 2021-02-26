<template>
  <div v-if="book != null">
    <section v-bind:class="{'ebook-only' : book.ebookOnly}" class="book-header container">
        <section class="center small">
            <book-card-cover :cover-id="book.coverId"></book-card-cover>
            <section class="info" :class="{ 'tall': bookId == 39 }">
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
                    <a v-if="book.ebookId != null" @click="getEbook" alt="Small Main Button" 
                    v-bind:class="[book.ebookOnly ? 'button-main' : 'button-secondary', isIOSpwa ? 'disabled' : '', 'small']">{{$t('book-index.get-ebook')}}</a>
                    <router-link v-if="!book.ebookOnly" to="1" append alt="Small Main Button" class="button-main small">{{$t('book-index.read-now')}}</router-link>
                    <router-link v-if="bookId == 39" :to="randomChapter" append alt="Small Main Button" class="button-main small">{{$t('book-index.read-random-chapters')}}</router-link>
                    <p class="ios-error" v-if="book.ebookId != null && isIOSpwa">{{$t('book-index.open-in-safari')}}</p>
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

export default {
    components: {        
        BookChaptersList,
        BookCardCover,
        LoadingSpinner
    },
    data() {
        return {
            loadingChapters: false,
        }
    },
    mixins: [BookMixins],
    computed: {
        isIOSpwa() {
            // Taken from https://stackoverflow.com/questions/50543163/can-i-detect-if-my-pwa-is-launched-as-an-app-or-visited-as-a-website
            const isIos = () => {
                const userAgent = window.navigator.userAgent.toLowerCase();
                return /iphone|ipad|ipod/.test( userAgent );
            }
            const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);
            return isIos() && isInStandaloneMode();
        },
        randomChapter() {
            var min = 3, max = 284;
            var randomNum = Math.floor(Math.random() * (max - min) + min);
            return randomNum+"";
        }
    },
    created() {
        if(!this.book.ebookOnly) {
            this.loadingChapters = true;
            this.loadChapters(this.bookId).then(() => {
                this.loadingChapters = false;
            })
        }
    },
    methods: {
        getEbook: async function(){
            if (this.isIOSpwa)
                return;
            await BaseApi.getDownloadEbookLink("blobs/ebook/" + [this.book.ebookId, this.book.language, this.book.title].join('_'))
                .then((downloadLink) => {
                    window.open(downloadLink, "_blank");
                });
        },
        ...mapActions('books', {
            loadChapters: 'loadChapters'
        }),
    }
};
</script>

<style>
@media only screen and (max-width: 648px) {
    .book-header .info.tall {
        padding-bottom: 86px;
    }
    .book-header .actions .long {
        width: calc(75% - 12px);
        margin: 8px 8px 0 0;
    }
}

.actions a.disabled{
    background: linear-gradient(to right, #c3c4c5 0%, #cad5db 100%);
    color: #777;
    cursor: default;
}
.actions a.disabled:hover {
    box-shadow: none;
}
.ios-error{
    font-size:13px;
    text-align:center;
    color:#FF403A;
}
</style>