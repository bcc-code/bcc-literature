<template>
    <section>
        <section v-if="book.bookType === BookType.BLAD">
            <h1>{{bookTitle}}</h1>
        </section>
        <section v-else>
            <h1>{{book.title}}</h1>
            <h6>
                <template v-if="book.author">
                    {{$t('book-index.written-by')}} {{book.author.fullName}}
                </template>
                <template v-if="book.author && book.year">
                        ·  
                </template>
                <template v-if="book.year">
                    {{book.year}}
                </template>
            </h6>
        </section>
    </section>
</template>

<script>
import moment from 'moment'
import { BookType } from '@/model/bookType.js';
export default {
    props: {
        book: {
            type: Object,
            required: true
        },
        year: {
            type: [Number, String],
            required: false
        },
        month: {
            type: [Number, String],
            required: false
        },
        title: {
            type: String,
            required: false
        }
    },
    computed: {
        BookType() {
            return BookType;
        },
        monthString() {
            return moment().month(this.month-1).format("MM");
        },
        bookTitle() {
            // Show title if manually set on article in case of a PDF issue
            return this.title.indexOf(this.book.title + ' - ') > -1 ? this.title : `${this.book.title} - ${this.year}/${this.monthString}`
        }
    }
}
</script>
