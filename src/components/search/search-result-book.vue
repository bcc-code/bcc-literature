<template>
    <article class="search-result">   
          <router-link class="result-book-only" :to="{ name: 'book-index', params: { bookId: result.id, parent: $route }}">          
              <book-card-cover :cover-id="result.coverId"></book-card-cover>
              <h4> {{ result.title }}</h4>
              <p> {{ authorFullName }}  ·  {{result.year}}</p>
          </router-link>
    </article>  
  </template>

<script>
import BookCardCover from 'components/grid/tiles/card-cover';
export default {
    props:{
        result:{
            type:Object,
            required:true
        },
    },
    components:{
        BookCardCover
    },
    computed: {
        authorFullName(){
            if (this.result.author) 
                return this.result.author.fullName;
            return "";
        }
    },
};
</script>

<style scoped>
.result-book-only {
    display: block;
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

article.search-result a.result-book-only figure {
    position: relative;
    display: block;
    width: 75px;
    height: 106px;
    padding: 0px;
    background: #838CA8;
    background-size: cover;
    margin: 0px 8px 0px 0px;
    float: left;
    border-radius: 2px;
}

article.search-result a.result-book-only h4 {
    padding-top: 15px;
    position: relative;
    margin: 0px;
    color: #16171A;
}

article.search-result a.result-book-only p {
    margin-bottom: 40px;
}
</style>