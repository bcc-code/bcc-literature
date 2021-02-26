<template>
    <section style="width:100%">
        <template v-for="(arr, gridName) in groupedList">
            <h1 :key="gridName">{{gridName}}</h1> 
            <article v-for="element in arr" :key="element.id">
                <router-link :to="{ name: 'read-publication', params: { bookId: element.bookId, year: element.year, month: element.month, chapterId: element.chapterId, parent: $route}}">
                    <h3>{{highlightedName(element.title)}}</h3>
                    <h5>{{element.year}}, {{element.month}}</h5>
                </router-link>
            </article>
        </template>
    </section>
</template>

<script>
import GridElementMixin from '@/mixins/grid-element.js'
export default {
    props: {
        list: {
            type: Array,
            required: true,
        },
        searchQuery: {
            type: String,
            default: ''
        }
    },
    mixins: [GridElementMixin],
    computed: {
        groupedList() {
            var listYears = {};
            var articles = this.list;

            for (var i=0; i < articles.length; i++) {
                var article = articles[i];
                if (article.author != null) {
                    if (listYears[article.year]) {
                        listYears[article.year].push(article);
                    } else {
                        listYears[article.year] = [article];
                    }
                }
            }

            for (var year in listYears) {
                listYears[year].sort(function(a, b) { return a.month - b.month });
            }

            return listYears;
        },
    }
}
</script>