<template>
    <section>
        <slot />
    </section>
</template>

<script>
export default {
    data : function(){
        return {
            searchQuery : ''
        }
    },
};
</script>