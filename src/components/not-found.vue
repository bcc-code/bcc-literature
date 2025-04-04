<template>
    <loader ref="loader">
        <section class="not-found container">
            <section class="center small">
                <div class="large section-header">
                    <h3>{{$t('not-found.title')}}</h3>
                </div>
                <br />
                <section class="list">
                    <h4>{{$t('not-found.suggestions')}}</h4>
                    <ol class="chapters">
                        <li v-for="(translation, index) in translations" :key="index" :chapter="index+1">
                            <a @click="changeBookLanguage(translation.language)">
                                <h5>
                                    <img class="flag" width="16" height="16" 
                                        :src="require('@/assets/flags/'+translation.language+'.svg')"
                                        :alt="translation.language" /> 
                                            {{translation.title}}
                                </h5>
                            </a>
                        </li>
                    </ol>
                </section>
            </section>
        </section>
    </loader>
</template>

<script>
import { EventBus, Events } from '@/utils/eventBus';
import { mapState, mapActions } from 'vuex';
import Loader from 'components/la-loader';

export default {
    components: {        
        Loader
    },
    data() {
        return {
            translations: {},
        }
    },
    methods: {
        async initialize() {
            if (this.$parent.isPublication) {
                await this.loadTranslationsForPublication({ year: this.$route.params.year, month: this.$route.params.month, chapterId: this.$route.params.chapterId }).then((result) => {
                    this.translations = result;
                })
            }
            else {
                await this.loadTranslationsForBook(this.$route.params.bookId).then((result) => {
                    this.translations = result;
                })
            }
        },
        ...mapActions('books', {
            loadTranslationsForBook: 'loadTranslationsForBook',
            loadTranslationsForPublication: 'loadTranslationsForPublication'
        }),
        changeBookLanguage(lang) {
            this.$store.commit('session/setAppLanguage', lang);
            this.$i18n.locale = lang;
            EventBus.$emit(Events.CONTENT_LANGUAGE_CHANGED);
        },
    },
};
</script>

<style scoped>
/* This style is only temporary */
.chapters li a {
    cursor: pointer;
}
.flag {
    vertical-align: text-bottom;
    margin-right: 5px;
}
</style>