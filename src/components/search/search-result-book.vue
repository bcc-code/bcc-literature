<template>
    <article class="search-result">   
          <router-link class="result-book-only" :to="{ name: 'book-index', params: { bookId: result.id, parent: $route }}">          
              <book-card-cover :cover-id="result.coverId"></book-card-cover>
              <div class="book-details">
                <h4>{{ result.title }}</h4>
                <p>{{ authorFullName }}  ·  {{result.year}}</p>
              </div>
          </router-link>
    </article>  
</template>
<script>
import BookCardCover from 'components/grid/tiles/card-cover';
export default {
    props: {
        result: {
            type: Object,
            required: true
        },
    },
    components: {
        BookCardCover
    },
    computed: {
        authorFullName() {
            if (this.result.author) 
                return this.result.author.fullName;
            return "";
        }
    },
};
</script>

<style scoped>
.result-book-only {
    display: flex;
    text-decoration: none;
    line-height: 20px;
    padding: 8px;
    margin: 0px;
    border-radius: 4px;
    -webkit-transition: background 0.2s;
    transition: background 0.2s;
    -webkit-transition-timing-function: ease-out;
    transition-timing-function: ease-out;
}

article.search-result .result-book-only figure {
    position: relative;
    display: block;
    min-width: 75px;
    width: 75px;
    height: 106px;
    padding: 0px;
    background: #838CA8;
    background-size: cover;
    margin: 0px 12px 0px 0px;
    float: left;
    border-radius: 2px;
}

article.search-result .result-book-only h4 {
    padding-top: 15px;
    position: relative;
    margin: 0px;
    color: var(--base1);
}

@media only screen and (max-width: 648px) {
    article.search-result .result-book-only .book-details {
        align-self: center;
    }
    article.search-result .result-book-only h4 {
        padding-top: 0;
    }
}
</style>