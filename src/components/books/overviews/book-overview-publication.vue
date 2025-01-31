<template>
    <div>
        <!--Book header-->
        <section class="publication-header container">            
            <section class="center small">
                    <h2>{{book.title}}</h2>
                    <h5>{{$t('book-index.since')}} {{book.year}}</h5>
            </section>
        </section>
        <!-- Publication issues -->
        <section class="container">
            <section class="center small">
                <!-- Year switcher header -->
                <div class="section-header publication">
                    <h5>{{$t('book-index.publication-issues-from')}}</h5>                    
                    <la-dropdown
                        @click="setYear"
                        :options="dropdownOptions"
                        :button-text="yearsText"
                        :inner-text="$t('book-index.choose-year')" />
                </div>
                <!-- Year details -->
                <section class="list">
                    <template v-for="publicationYear in publicationsFilteredByYear">
                        <publication-month
                        v-for="publicationMonth in publicationYear.months"
                        :key="`${publicationMonth.year}-${publicationMonth.monthName}`"
                        :publication-month="publicationMonth"
                        :book="book" />
                    </template>
                    <a class="pagination-button"
                    v-if="nextYear !== null"
                    @click="switchToNextYear()">
                        <h5>{{$t('book-index.show')}} {{nextYear}}</h5>
                    </a>
                </section>
            </section>
        </section>
    </div>
</template>

<script>
import PublicationMonth from 'components/books/overviews/publications/publication-month';
import Subscription from 'components/subscriptions';
import LaDropdown from '@/components/la-dropdown';
import BookApi from 'utils/api/bookApi';
import BookMixins from '@/mixins/book';
import Vue from 'vue';

export default {
    components: {        
        PublicationMonth,
        LaDropdown,
        Subscription
    },
    data() {
        return {
            publicationInformation: null,
            isSubscribed: null,
            filter: {
                years: [],
            },
            loadingYears: false,
            loadingPublications: false,
            allYears: [],
            publications: {},
        }
    },
    watch: {
        filter: {
            deep: true,
            handler (newValue, oldValue) {
                if(newValue.years != null) {
                    for(var year of newValue.years)  {
                        this.loadPublications(year);
                    }
                }
            }
        }
    },
    mixins: [BookMixins],
    computed: {
        yearsText() {
            var years = this.filter.years.join(", ");
            return years;
        },
        publicationsFilteredByYear() {
            return this.filter.years.map((year) => {
                return {
                    year,
                    months: this.publications[year]
                };
            })
        },
        nextYear() {
            if(this.filter.years == null || this.filter.years.length <= 0) {
                return this.allYears[0];
            }
            if(this.allYears == null || this.allYears.length <= 0) {
                // Seperation between undefined and null is important in this function because we check === null in the frontend.
                return undefined;
            }
            var latestFilteredYear = this.filter.years[this.filter.years.length-1];
            var indexOfLatest = this.allYears.findIndex((y) => y === latestFilteredYear);
            var nextYear = this.allYears[indexOfLatest+1];
            return nextYear || null;
        },
        dropdownOptions() {
            return this.allYears.map((year) => {
                return {
                    value: year,
                    title: year.toString()
                };
            });
        },
    },
    mounted() {
        this.loadAllYears().then(() => {
            this.setYear(this.allYears[0]);
        });
    },
    methods: {
        loadAllYears() {
            this.loadingYears = true;
            return BookApi.getYearsByPublication(this.book.id).then((result) => {
                this.allYears = result.data;
                this.loadingYears = false;
            });
        },
        async loadPublications(year) {
            if(this.publications[year] != null) {
                return;
            }
            this.loadingPublications = true;
            var publications = null;
            await BookApi.getMonthlyPublicationsForYear(this.book.id, year)
                .then((result) => {
                    publications = result.data;
                    this.loadingPublications = false;
                });
            if(publications != null){
                Vue.set(this.publications, year, publications);
            }
        },
        setYear(year) {
            this.filter.years = [year];
        },
        switchToNextYear() {
            this.setYear(this.nextYear);
            window.scrollTo(0, 0);
        },
    }

};
</script>
