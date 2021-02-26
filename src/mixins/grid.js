import { GridType, GridLayout } from '@/model/gridType.js';
export default {
    computed: {
        GridType(){
            return GridType;
        },
        GridLayout(){
            return GridLayout;
        },
        /* Booleans */
        isAuthor(){
            return this.type == GridType.AUTHOR;
        },
        isBook(){
            return this.type == GridType.BOOK;
        },
        isPublication(){
            return this.type == GridType.PUBLICATION;
        },
        isArticle(){
            return this.type == GridType.ARTICLE;
        },
        isTiles(){
            return this.layout == GridLayout.TILES;
        },
        isList(){
            return this.layout == GridLayout.LIST;
        },
    },

}