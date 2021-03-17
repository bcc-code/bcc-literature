<template>
    <div :id="'documentview-'+article.chapterId">
        <div class="documentview-container" :id="'documentview-container-'+article.chapterId" >
            <iframe width="440px" height="330px" :src="article.documentUrl" frameborder="0" allowfullscreen="true" referrerpolicy="origin-when-cross-origin" allowtransparency="true"></iframe>
        </div>
    </div> 
</template>

<script>
export default {
    props: ['article'],
}
</script>

<style>
.documentview-container{
    pointer-events: auto;
    margin-top:20px;
    margin-bottom:20px;
    width:100%;
    height:50vh;
    background-color:#f0ede4;
    background-image:url('//widgets.brunstad.org/design/brunstad/images/spinner-transparent.gif');
    background-repeat:no-repeat;
    background-position: 0 0;
    background-position:center;
}

.documentview-container iframe{
    width:100%;
    height:100%;
}
</style>
