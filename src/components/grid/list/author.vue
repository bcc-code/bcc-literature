<template>
    <section style="width:100%">
        <article class="letter" v-for="(arr, gridName) in groupedList" v-bind:key="gridName">
            <h1>{{gridName}}</h1>
            <p v-for="element in arr" :key="element.id">
                <router-link :to="{ name: 'author-index', params: { authorId: element.id }}" 
                class="author-name"
                v-html="highlightedName(element.fullName)"></router-link>
            </p>   
        </article>
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
            var alphaList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "Å", "Ø"];
            var listNames = alphaList.reduce((index, alpha) => {
                return { ...index, [alpha]:[] };
            }, {});

            for (var i=0; i < this.list.length; i++) {
                var item = this.list[i];
                var alpha = item.fullName.charAt(0).toUpperCase();

                if (listNames[alpha] && this.isSearchResult(item.fullName))
                    listNames[alpha].push(item);
            }
            Object.keys(listNames).forEach((key) => (listNames[key].length == 0) && delete listNames[key]);
            for (var alpha in listNames) {
                listNames[alpha].sort(function(a, b) { return a.fullName - b.fullName });
            }

            return listNames;
        },
    }
}
</script>
<style scoped>
/* Temporary Style taken from the reader */
a.author-name >>> span{
    color: #6291EB;
    background: rgba(0, 46, 148, 0.1);
}
</style>