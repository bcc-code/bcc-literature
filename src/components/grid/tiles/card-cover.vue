<template>
    <figure v-bind:style="[(hasCover) ? {'background-image':coverUrl } : {}]">
        <h5 v-if="!hasCover && type == 'book'">{{name}}</h5>
    </figure>
</template>

<script>
import keys from 'keys'

export default {
    props: {
        coverId: {
            default: null,
            required: false
        },
        name: {
            type: String,
            required:false
        },
        type: {
            type: String,
            default: 'book'
        }
    },
    computed:{
        coverUrl(){
            return "url(" + keys.API_BASE_PATH + "blobs/image/" + this.type +"/" + this.coverId + ")";
        },
        hasCover(){
            return this.coverId != null;
        }
    }
};
</script>