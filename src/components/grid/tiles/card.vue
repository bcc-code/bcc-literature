<template>
  <article :class="articleClass" v-if="isSearchResult(name)">
    <router-link :to="route">
      <CardCover :cover-id="element.coverId" :name="name" :type="stringType"></CardCover>
      <h4 v-html="highlightedName(name)"></h4>
      <p v-if="element.author != null" class="small">{{element.author.fullName}}</p>
      <h6 v-if="availability != null">{{availability}}</h6>
    </router-link>
  </article>
</template>

<script>
import CardCover from './card-cover'
import GridElementMixin from '@/mixins/grid-element.js'
import { GridType } from '@/model/gridType.js'

export default {
    props: {
        element: {
            type: Object,
            required: true
        },
        searchQuery: {
            type: String,
            default: ''
        }
    },
    mixins: [GridElementMixin],
    components: {
        CardCover
    },
    computed: {
        route() {
            return (this.element.type == GridType.BOOK) 
                ? { name: 'book-index', params: { bookId: this.element.id, parent: this.$route }}
                : { name: 'author-index', params: { authorId: this.element.id, parent: this.$route }}
        },
        name() {
            return (this.element.type == GridType.BOOK)
                ? this.element.title
                : this.element.fullName
        },
        availability() {
            return (this.element.type == GridType.BOOK)
                ? (this.element.ebookOnly ? '' : 'Online') + ((!this.element.ebookOnly && this.element.ebookId!= null) ? ' · ' : '') + ((this.element.ebookId != null) ? 'e-Book' : '')
                : null
        },
        stringType() {
            return (this.element.type == GridType.BOOK)
                ? 'book'
                : 'author'
        },
        articleClass() {
            return (this.element.type == GridType.BOOK)
                ? 'book'
                : 'popular-author'
        }
    }
};
</script>

<style scoped>
/* Temporary Style taken from the reader */
a h4 >>> span{
    color: #6291EB;
    background: rgba(0, 46, 148, 0.1);
}
</style>