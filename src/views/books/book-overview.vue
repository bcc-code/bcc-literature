<template>
    <section>
    <app-header :showBackButton="false" :pageName="$t('books.books')" />
    <section class="container container-ssf">
        <section class="center">
            <div class="readable-container">
                <h3>Tilgang til Skjulte Skatter og litteratur</h3>
                <p>Vi har gleden av å informere om at Skjulte Skatters Forlag nå har lansert første utgave av vår nye litteraturportal, der bladet Skjulte Skatter, sangboken Herrens Veier, ulike Bibeloversettelser og mye av forlagets egen litteratur er tilgjengelig i digitalt format. Digitale utgaver av Skjulte Skatter fra og med januar 2025 er tilgjengelig både som tekst i selve litteraturportalen og som nedlastbare PDF-filer.</p>
                <p>Forlaget vil de neste månedene videreutvikle litteraturportalen med funksjonalitet og verktøy som gjør det enklere å finne fram i, og tilegne seg innholdet, herunder muligheten til å synkronisere notater på tvers av enheter, vise to tekster på skjermen samtidig, dele innhold og samhandle med andre brukere. I tillegg vil vi etter hvert integrere AI-verktøy for søk og oppsummering av innhold.</p>
                <p>For å få tilgang til litteraturportalen må du først registrere en ny bruker via <a href="https://app.hiddentreasures.org/bcc" target="_blank">denne linken</a>. Dette gjelder også selv om du er eksisterende abonnent. Etter registrering vil du motta en bekreftelse på epost der du blir bedt om å verifisere din epostadresse. Straks du har gjort dette vil du bli sendt til litteraturportalen, der du får opp en melding med mulighet til å linke din konto hos oss mot din BCC-konto.</p>
                <p>Har du spørsmål eller trenger hjelp med å få tilgang kan du henvende deg på epost til <a href="mailto:ticket@hiddentreasures.org">ticket@hiddentreasures.org</a>.</p>
                <p>Hjertelig hilsen,<br />
                Redaksjonen</p>
            </div>
        </section>
    </section>
    <section class="center x-small">
            <search-box />
        </section>
    <loader>
        <grid :list="publications" :title="$t('subscription.subscriptions')" :layout="GridLayout.TILES" :type="GridType.PUBLICATION"/>
        <SearchableGrids>
            <grid :list="books" :title="$t('books.books-all')" :layout="GridLayout.TILES" :type="GridType.BOOK" />
        </SearchableGrids>
    </loader>
  </section>
</template>

<script>
import { EventBus, Events } from '@/utils/eventBus';
import { mapActions, mapState } from 'vuex';
import SearchableGrids from 'components/grid/searchable-grids';
import Grid from 'components/grid/grid';
import GridMixin from '@/mixins/grid.js';
import { BookType } from '@/model/bookType.js';
import AppHeader from 'components/layout/app-header';
import SearchBox from 'components/search/search-box';
import SongTreasuresNotice from 'components/song-treasures-notice';
import UserVoiceBanner from 'components/user-voice-banner';
import Loader from 'components/la-loader';

export default {
    components: {
        Grid,
        SearchBox,
        SongTreasuresNotice,
        UserVoiceBanner,
        Loader,
        AppHeader,
        SearchableGrids
    },
    mixins: [GridMixin],
    computed: {
        ...mapState('books', {
            all: state => state.base.all,
        }),
        books() {
            return this.all.filter((el) => el.bookType && el.bookType != BookType.BLAD);
        },
        publications() {
            return this.all.filter((el) => this.books.indexOf(el) < 0);
        },
    },
    methods: {
        ...mapActions('books', {
            loadAll: 'loadAll'
        }),
        async initialize() {
            await this.loadAll(false)
        },
    },
};
</script>

<style scoped>
.banners {
    display: flex;
}

@media only screen and (max-width: 1049px) {
    .banners {
        flex-direction: column;
    }
}   
</style>