<template>
    <section class="list">
        <ol class="chapters">
            <li v-for="(chapter, index) in chapters" :key="index">
                <router-link 
                :to="`${chapter.id}`"
                append
                :title="`(Chapter) #${chapter.id} – ${chapter.title}`"
                :alt="chapter.title">
                    <h5>{{chapter.title}}</h5>
                </router-link>
            </li>
        </ol>
    </section>
</template>

<script>
export default {
    props: ['chapters']
}
</script>