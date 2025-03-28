<template>
    <section>
    <app-header :showBackButton="false" :pageName="$t('books.books')" />
    <section class="container container-ssf" v-if="!continueOnPortal">
        <section class="center">
            <div class="readable-container">
                <div class="text-center mb-4">
                    <img src="../../assets/literature-portal-logo.png" width="150">
                </div>
                <h2>Tilgang til Skjulte Skatter og litteratur</h2>
                <p class="lead">Vi har gleden av å informere om at Skjulte Skatters Forlag nå har lansert første utgave av vår nye litteraturportal, der bladet Skjulte Skatter, sangboken Herrens Veier, ulike Bibeloversettelser og mye av forlagets egen litteratur er tilgjengelig i digitalt format.</p>

                <div class="flex sm-flex-col">
                    <div class="portal-info">
                        <p>Forlaget vil de neste månedene videreutvikle litteraturportalen med funksjonalitet og verktøy som gjør det enklere å finne fram i, og tilegne seg innholdet, herunder muligheten til å synkronisere notater på tvers av enheter, vise to tekster på skjermen samtidig, dele innhold og samhandle med andre brukere. I tillegg vil vi etter hvert integrere AI-verktøy for søk og oppsummering av innhold.</p>

                        <h3>Slik får du tilgang</h3>
                        <p>For å få tilgang til litteraturportalen må du først <a href="https://app.hiddentreasures.org/bcc" target="_blank">registrere en ny bruker</a>. Dette gjelder også selv om du er eksisterende abonnent. Etter registrering vil du motta en bekreftelse på epost der du blir bedt om å verifisere din epostadresse. Straks du har gjort dette vil du bli sendt til litteraturportalen, der du får opp en melding med mulighet til å linke din konto hos oss mot din BCC-konto.</p>

                        <p>Digitale utgaver av Skjulte Skatter fra og med januar 2025 er tilgjengelig både som tekst i selve litteraturportalen og som nedlastbare PDF-filer.</p>
                        
                        <h3>Har du spørsmål?</h3>
                        <p>Har du spørsmål eller trenger hjelp med å få tilgang kan du henvende deg på epost til <a href="mailto:ticket@hiddentreasures.org">ticket@hiddentreasures.org</a>.</p>
                        
                        <p>Hjertelig hilsen,<br />
                        Redaksjonen</p>
                    </div>

                    <div class="text-center p-2">
                        <a href="https://app.hiddentreasures.org/bcc" target="_blank"><img src="../../assets/SSF_portal_desktop.png" width="250"></a>
                        <p>Jeg er ny her<br />
                        <a href="https://app.hiddentreasures.org/bcc" target="_blank" class="register-account">Registrer ny bruker</a></p>
                        <br />

                        <p class="no-margin">Jeg har allerede bruker<br />
                            <a href="https://app.hiddentreasures.org/bcc" target="_blank" class="go-to-portal">Gå til portalen<span class="icon chevron"></span></a>
                        </p>
                        
                        <p class="continue-on-portal" @click="continueOnPortal = true">
                            <span class="underline">Jeg ønsker å fortsette til</span><br />
                            <span class="underline">den gamle litteratur-siden</span><br />
                            <span class="icon chevron down"></span>
                        </p>                        
                    </div>
                </div>
            </div>
        </section>
    </section>
    <section class="center x-small" v-if="continueOnPortal">
        <search-box />
    </section>
    <loader v-if="continueOnPortal">
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
import Loader from 'components/la-loader';

export default {
    components: {
        Grid,
        SearchBox,
        Loader,
        AppHeader,
        SearchableGrids
    },
    mixins: [GridMixin],
    data: function() {
        return {
            continueOnPortal: false
        }
    },
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

.text-center {
    text-align: center;
}

.no-margin {
    margin: 0 !important;
}

.underline {
    border-bottom: 2px solid #64707580;
    padding-bottom: 2px;
}

@media only screen and (max-width: 1049px) {
    .banners {
        flex-direction: column;
    }
}   
</style>