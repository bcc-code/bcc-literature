import keys from "keys";

export default {
    metaInfo() {
        const cover = `${keys.API_BASE_PATH}blobs/image/author/preview`;
        const title = 'BCC Literature';
        return {
            title: title,
            meta: [{
                itemprop: 'name',
                content: title
            },{
                itemprop: 'image',
                content: cover
            },{
                property: 'og:title',
                content: title
            },{
                property: 'og:image',
                content: cover
            },{
                property: 'og:url',
                content: keys.APP_URL
            },{
                name: 'twitter:title',
                content: title
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
