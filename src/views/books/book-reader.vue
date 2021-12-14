<template>
  <div>
    <not-found v-if="notFound" />
    <template v-else>
        <section class="container reading-view">
            <app-header :backButtonRoute="getBackButtonRoute" :pageName="book ? book.title : ''" />
            <loader ref="loader">
                <article class="center small" :style="{ zoom: fontSize }">  
                    <template v-if="!articles || (book != null && showingFirstChapter)">
                        <Title :book="book" :year="year" :month="month" :title="articles[0].title"/>
                    </template>
                    <ArticleScroller v-if="isContentVisible"
                        :articles="articles"
                        :loadTopHandler="( isPublication || showingFirstChapter) ? null : loadTop"
                        :loadBottomHandler="isPublication  ? null : loadBottom"
                        :getElementName="(article) => getElementName(article)"
                        :no-lazy-load="isPublication"
                        @change="(article) => setCurrentChapter(article.chapterId)"
                    >
                        <ArticleFull v-for="article in articles"
                            :key="article.id"
                            :article="article"
                            :highlight="wordsToHighlight"
                            :audioBookUrl="audioBookUrl"
                            :bookTitle="bookTitle"
                            :id="getElementName(article)"
                            ref="articles" />
                    </ArticleScroller>
                    <SubscriptionRequired :book="book" v-else></SubscriptionRequired>
                </article>
            </loader>
        </section>
        <a alt="Toggle Sidebar" class="toggle-sidebar button-circular main" @click="showSidebar = !showSidebar"></a>
        <a alt="Share" class="share button-circular secondary" @click="openShareModal"></a>
        <app-sidebar @chapterChanged="changeChapter" @close="showSidebar = false"/>
        <ShareLinkModal :url="shareUrl" :message="shareMessage"></ShareLinkModal>
        <TextToSpeechPlayer :articles="articles" />
    </template>
    <div id="print-footer">© Copyright Skjulte Skatters Forlag N-4098 Tananger, Norway.</div>
  </div>
</template>

<script>
import AppHeader from 'components/layout/app-header';
import AppSidebar from 'components/layout/app-sidebar';
import TextToSpeechPlayer from 'components/layout/app-text-to-speech-player';
import ShareLinkModal from 'components/reader/share-link-modal';
import NotFound from 'components/not-found';
import BookMixins from '@/mixins/book';
import Loader from 'components/la-loader';
import Title from 'components/reader/reader-title.vue';
import ArticleScroller from 'components/reader/article-scroller';
import ArticleFull from 'components/reader/article-full';
import SubscriptionRequired from 'components/reader/subscription-required-info';
import FontFaceObserver from 'fontfaceobserver';
import ReaderMixins from '@/mixins/reader';
import BaseApi from '@/utils/api/baseApi.js';
import { mapActions, mapState } from 'vuex';
import BookMetaHeaderMixins from "@/mixins/book-meta-header";

export default {
    components: {
        AppHeader,
        Loader,
        Title,
        ArticleFull,
        ArticleScroller,
        SubscriptionRequired,
        AppSidebar,
        NotFound,
        TextToSpeechPlayer,
        ShareLinkModal
    },
    data() {
        return {
            showSidebar: true,
            notFound: false,
            articles: [],
            amountToLoad: 5,
            readingChapterId: null
        }
    },
    created() {
        this.showSidebar = false;
    },
    mounted() {
        // Set class name if the player is open
        if (this.currentArticleId != -1) {
            document.getElementById('content').classList.add('player-on');
        }
    },
    mixins: [BookMixins, ReaderMixins, BookMetaHeaderMixins],
    computed: {
        ...mapState('session', ['fontSize']),
        ...mapState('textToSpeech',{
            currentArticleId: 'currentArticleId',
            isPlaying: 'isPlaying',
        }), 
        allArticles() {
            return this.$store.getters['articles/getAllByBookId'](this.bookId);
        },
        chapterId() {
            return parseInt(this.$route.params.chapterId);
        },
        wordsToHighlight() {
            return this.$route.params.highlight;
        },
        showingFirstChapter() {
            return this.articles[0] && this.isFirstChapter(this.articles[0].chapterId);
        },
        isContentVisible() {
            return this.articles.every((el) => { return el.contentVisible });
        },
        getBackButtonRoute() {
            return this.$route.params.parent ? this.$route.params.parent : { name: 'book-index', params: { bookId: this.$route.params.bookId }};
        },
        audioBookUrl() {
            return this.book.audioBookUrl;
        },
        bookTitle() {
            return this.book.title;
        },
        shareUrl() {
            return BaseApi.addLanguageQuery(window.location.origin + this.$route.fullPath);
        },
        selectedChapter() {
            return this.$route.params.chapterId
        },
        selectedChapterTitle() {
            if (this.chapters.some(el => el.id == this.selectedChapter))
                return this.chapters.find(el => el.id == this.selectedChapter).title
            return ''
        },
        shareMessage() {
            return this.$t('share.message', { chapterName: this.selectedChapterTitle });
        }
    },
    methods: {
        ...mapActions('books', {
            loadBook: 'load',
            loadChapters: 'loadChapters'
        }),
        ...mapActions('articles', {
            loadChapter: 'loadChapter',
            ensureSurroundingChapters: 'ensureSurroundingChapters',
            loadArticlesByMonth: 'loadArticlesByMonth'
        }),
        ...mapActions('textToSpeech', {
            toggleSpeak: 'toggleSpeak',
        }),
        async initialize() {
            this.articles = [];
            this.notFound = false;

            await this.loadBook(this.bookId).then(async (book) => {
                if (book.redirectToCorrectLanguage) {
                    let chapterId = parseInt(this.$route.params.chapterId);
                    this.$router.push({ name: 'read-publication', 
                        params: {
                            bookId: book.id, 
                            year: parseInt(this.$route.params.year), 
                            month: parseInt(this.$route.params.month),
                            chapterId: isNaN(chapterId) ? 1 : chapterId,
                            parent: this.$route.params.parent,
                        }});
                }
                this.isPublication
                    ? await this.loadArticlesByMonth({ bookId: this.bookId, month: this.month, year: this.year }).then((articles) => {
                        this.articles = articles;
                    })
                    : await this.loadChapters(this.bookId).then(async () => {
                        await this.ensureSurroundingChapters({ bookId: this.bookId, chapterId: this.chapterId, count: this.amountToLoad }).then(() => {
                            this.articles = this.allArticles;
                        });
                    })

                var font = new FontFaceObserver('Merriweather');
                await font.load();
            }).catch((error) => {
                window.scrollTo(0,0);
                this.notFound = true
            });
        },
        afterInitialize() {
            this.scrollToChapter(this.chapterId);

            // Play the audiobook or Listen on BMM
            if (this.$route.hash == '#play' ||
                this.$route.hash == '#bmm') {
                this.playArticle(this.$route.params.chapterId, true);
            }
        },
        changeChapter(chapterId) {
            this.showSidebar = false;
            if (this.scrollToChapter(chapterId) == false) {
                /* Force reload the reader component */
                this.$store.dispatch('articles/base/reset');
                this.setCurrentChapter(chapterId);
                this.$refs.loader.reset();
            };

            // Play the new chapter only if the player is open and the current book is not on BMM
            if (this.currentArticleId != -1 && !this.audioBookUrl) {
                this.playArticle(chapterId);
            }
        },
        playArticle(chapterId, startedFromBookOverview) {
            let audioBookUrl = this.audioBookUrl;
            let bookTitle = this.bookTitle;

            this.toggleSpeak(
                {...this.allArticles.find(el => el.chapterId == chapterId), audioBookUrl, bookTitle, startedFromBookOverview}
            );
        },
        openShareModal() {
            if (navigator.share) {
                navigator.share({
                    title: this.selectedChapterTitle,
                    text: this.shareMessage,
                    url: this.shareUrl
                });
            }
            else {
                this.$modal.show('shareUrlModal');
            }
        }
    },
    watch: {
        showSidebar: function () {
            this.showSidebar ? document.body.classList.add("sidebar-open") : document.body.classList.remove("sidebar-open");
        }
    }
};
</script>

<style>
#print-footer {
    display: none;
}

@media print {
    @page { 
        size: auto;
        margin: 27mm 16mm 27mm 16mm; 
    } 
    #bcc-widget-topbar, header, footer {
        display: none !important;
    }
    #print-footer {
        display: block;
        position: fixed;
        font-size: 15px;
        font-style: italic;
        left: 0;
        bottom: 3px;
    }
    body {
        padding: 0 !important;
    }
    .reading-view {
        padding: 0 !important;
        background: #fff !important;
        color: #000 !important;
    }
    .reading-view article.center p, .reading-view article.center h5, .reading-view article.center h2 {
        color: #000 !important;
        margin-bottom: 15px !important;
        page-break-inside: avoid;
    }
}
</style>
<style scoped>
/* Temporary style */
.button-circular.main.share {
    right: 12px;
    top: 156px;
    position: fixed;
    z-index: 40;
    background: url(/img/icon_24_share.svg) 50% no-repeat,-webkit-gradient(linear,left top,right top,from(#666cf6),to(#5eafe2));
    background: url(/img/icon_24_share.svg) 50% no-repeat,linear-gradient(90deg,#666cf6 0,#5eafe2);
    -webkit-transition: all .3s;
    transition: all .3s;
    -webkit-transition-timing-function: ease-out;
    transition-timing-function: ease-out;
}

@media only screen and (max-width: 648px) {
    .button-circular.main.share {
        -webkit-transition: all .3s;
        transition: all .3s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
        top: calc(100% - 68px);
        right: 62px;
    }
}
</style>
