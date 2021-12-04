import keys from "keys";

export default {
    metaInfo() {
        const cover = (this.author && this.author.coverId) ? `${keys.API_BASE_PATH}blobs/image/author/${this.author.coverId}`: '';
        const title = this.author ? this.author.fullName: '';
        const titleTemplate =  !!title ? `BCC Literature - ${title}`: 'BCC Literature';
        return {
            title: titleTemplate,
            meta: [{
                itemprop: 'name',
                content: titleTemplate
            },{
                itemprop: 'image',
                content: cover
            },{
                property: 'og:title',
                content: titleTemplate
            },{
                property: 'og:image',
                content: cover
            },{
                property: 'og:url',
                content: keys.APP_URL
            },{
                name: 'twitter:title',
                content: titleTemplate
            },{
                name: 'twitter:image',
                content: cover
            },{
                name: 'twitter:url',
                content: keys.APP_URL
            }]
        };
    },
    watch: {
        author() {
            this.$meta().refresh();
        }
    }
};
