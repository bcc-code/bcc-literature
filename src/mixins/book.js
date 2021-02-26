
import { BookType } from '@/model/bookType.js';

export default {
    computed: {
        book() {
            return this.$store.getters['books/base/getById'](this.$route.params.bookId);
        },
        bookId() {
            return this.$route.params.bookId;
        },
        year(){
            return this.$route.params.year;
        },
        month(){
            return this.$route.params.month;
        },
        chapters() {
            if (this.book == null)
                return [];
            if (this.isPublication)
                return this.$store.getters['articles/getTitlesByMonth'](this.bookId, this.year, this.month);
            return this.book.chapters || [];
        },
        BookType() {
            return BookType;
        },
        isPublication() {
            return this.book != null && this.book.bookType === BookType.BLAD;
        },
    }
}