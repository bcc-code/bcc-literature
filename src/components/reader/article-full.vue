<template>
    <div>
        <h5 :id="'chapter-title-'+article.chapterId">{{$t('reader.chapter')}} {{article.chapterId}} <button @click="toggleTextToSpeech(article)">({{speechTextButton}})</button></h5>
        <div v-if="article.content != null" v-html="article.content" />
        <DocumentViewer v-else :article="article" />
   </div>
</template>

<script>
import DocumentViewer from "./document-viewer"

export default {
    props: ['article', 'highlight'],
    components: {
        DocumentViewer
    },
    data() {
        return {
            speechTextButton: "Read"
        }
    },
    mounted() {
        if (this.highlight != null && this.highlight.length > 0) {
            this.article.content = this.article.content.replace(new RegExp("([^a-zA-Z])("+ this.highlight.join('|') +")(?=[^a-zA-Z])", 'gi'), "$1<span>$2</span>");
        }
    },
    methods: {
        toggleTextToSpeech(article) {
            this.$emit('toggleTextToSpeech', article);
        },
    }
}
</script>
<style>
.reading-view ol, .reading-view ul {
    list-style: none;
    padding-left: 0;
}

.reading-view li {
    font-family: Merriweather, serif;
    color: #5a617d;
    font-size: 2.1em;
    line-height: 2em;
    font-weight: 400;
    margin-bottom: 0;
    text-indent: 2em;
}
</style>