<template>
    <section>
        <app-header :showBackButton="false" :pageName="$t('authors.authors')" />
        <loader>
            <section>
                <section class="container author-library" >
                    <SearchableGrids>
                        <Grid :list="authorsPopular" :title="$t('authors.authors-popular')" :layout="GridLayout.TILES" :type="GridType.AUTHOR" />
                        <Grid :list="authorsAll" :title="$t('authors.authors-all')" :layout="GridLayout.LIST" :type="GridType.AUTHOR" />    
                    </SearchableGrids>        
                </section>
            </section>
        </loader>
    </section>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import SearchableGrids from 'components/grid/searchable-grids';
import Grid from 'components/grid/grid';
import GridMixins from '@/mixins/grid.js';
import AppHeader from 'components/layout/app-header';
import Loader from 'components/la-loader';
import AuthorMetaHeaderMixins from "@/mixins/author-meta-header";

export default {
    components: {
        SearchableGrids,
        Grid,
        AppHeader,
        Loader
    },
    mixins: [GridMixins, AuthorMetaHeaderMixins],
    computed: {
        ...mapState("authors", {
            authorsAll: state => state.base.all,
            authorsPopular: "popular",
        }),
    },
    methods: {
        ...mapActions("authors", {
            loadAll: "loadAll",
        }),
        async initialize() {
            await this.loadAll(false);
        }
    }
}
</script>
















