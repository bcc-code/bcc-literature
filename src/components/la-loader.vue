<template>
	<section>
		<LoadingSpinner v-if="loading" />
		<slot v-else></slot>
	</section>
</template>

<script>
import { EventBus, Events } from '@/utils/eventBus';
import LoadingSpinner from 'components/loading-spinner'
export default {
    components: {
        LoadingSpinner
    },
    data: function(){
        return {
            loading: true
        }
    },
    methods: {
        async reset(forceReload = false) {
            this.loading = true;
            var slot = this.$slots.default[0].context;
            await slot.initialize(forceReload).then(() => {
                this.loading = false;
                // Possibly trigger a function on the slot 
                if (slot.afterInitialize != undefined)
                    slot.afterInitialize();
            });
        },
        async forceReset() {
            await this.reset(true)
        }
    },
    async mounted() {
        EventBus.$on(Events.CONTENT_LANGUAGE_CHANGED, this.forceReset);
        this.reset(false);
    },
    destroyed() {
        EventBus.$off(Events.CONTENT_LANGUAGE_CHANGED, this.forceReset);
    },
}
</script>