import Vue from 'vue';
export default {
    methods: {
        async loadTop() {
            let firstId = this.articles[0].chapterId;
            const articlesToGet = new Array();
            for (let i = 1; i <= this.amountToLoad; i++) {
                articlesToGet.push(firstId - i);
            }
            await this.loadRange(articlesToGet).then((newArticles) => {
                this.articles = newArticles.concat(this.articles);
                this.scrollToChapter(firstId, -200);
            });
        },
        async loadBottom() {
            let bottomId = this.articles[this.articles.length-1].chapterId;
            if (this.isLastChapter(bottomId)) {
                return;
            }
            const articlesToGet = new Array();
            for (let i = 1; i <= this.amountToLoad; i++) {
                articlesToGet.push(bottomId + i);
            }
            await this.loadRange(articlesToGet).then((newArticles) => {
                this.articles = this.articles.concat(newArticles);
            });
        },
        async loadRange(articlesToGet) {            
            let articlesToLoad = new Array();
            let articles = new Array();
            articlesToGet.forEach((aChapterId) => {
                let a = this.allArticles.find((a) => a.chapterId == aChapterId);
                if (!a) {
                    articlesToLoad.push(aChapterId);
                    return;
                }
                articles.push(a);
            });

            for (const articleToLoad of articlesToLoad) {
                let loadedArticle = await this.loadChapter({ bookId: this.bookId, chapterId: articleToLoad });
                if (loadedArticle) {
                    articles.push(loadedArticle);
                }
            };

            return articles.sort((a, b) => parseInt(a.chapterId) - parseInt(b.chapterId));
        },
        getElementName(article) {
            if(!article) return null;
            return `chapter-element-${article.chapterId}`;
        },
        scrollToChapter(chapterId, offset = -100) {
            let article = this.articles.find((a) => a.chapterId === chapterId);
            if (!article) return false;
            var self = this;
            window.scrollTo(0,0);
            if (chapterId >= 2) {
                Vue.nextTick()
                    .then(() => {
                        let chapterElementRect = document.querySelector('#'+self.getElementName(article)).getBoundingClientRect();
                        window.scrollTo(0, chapterElementRect.top + offset);
                    });
            }
        },
        setCurrentChapter(chapterId) {
            if (this.isPublication)
                this.$router.replace({ 
                    name: 'read-publication',
                    params: {
                        bookId: this.bookId,
                        year: this.year,
                        month: this.month,
                        chapterId: chapterId,
                        highlight: this.highlight,
                        parent: this.$route.params.parent
                    }
                });
            else
                this.$router.replace({
                    name: 'read',
                    params: {
                        bookId: this.bookId,
                        chapterId: chapterId,
                        highlight: this.highlight,
                        parent: this.$route.params.parent
                    }
                });
        },
        isFirstChapter(id) {
            if (this.isPublication)
                return id==1;
            return this.book ? this.book.chapters ? this.book.chapters[0].id === id : false : false;
        },
        isLastChapter(id) {
            if(!this.book || !this.book.chapters) {
                return;
            }
            var chapter = this.book.chapters[this.book.chapters.length-1];
            return chapter.id === id;
        },
    }
}