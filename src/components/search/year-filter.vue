<template>
    <section class="range-slider">
        <input v-model="value1" :min="minYear" :max="maxYear" step="1" type="range">
        <input v-model="value2" :min="minYear" :max="maxYear" step="1" type="range">
        <p class="range-values">
            <span>{{minYearValue || '-' }}</span>
            <span v-if="minYearValue != minYear || maxYearValue != maxYear" @click="clear" class="range-clear">Clear</span>
            <span>{{maxYearValue || '-' }}</span>
        </p>
    </section>
</template>
<script>
import { mapActions } from 'vuex';
export default {
    data: function () {
        return {
            minYear: 1900,
            value1: null,
            value2: null,
            delay: null,
            initialized: false,
        }
    },
    created() {
        this.initialized = false
        let years = this.$store.state.search.searchParams.facets.Years
        if (years.length > 0) {
            this.value1 = years[0];
            this.value2 = years[1];
        }
        else {
            this.value1 = this.minYear;
            this.value2 = this.maxYear;
        }
        setTimeout(() => this.initialized = true, 200);
    },
    computed: {
        minYearValue() {
            return Math.min(this.value1, this.value2)
        },
        maxYearValue() {
            return Math.max(this.value1, this.value2)
        },
        maxYear() {
            return new Date().getFullYear();
        }
    },
    methods: {
        ...mapActions('search', ['newYearsFilter']),
        clear() {
            this.initialized = false;
            this.value1 = this.minYear;
            this.value2 = this.maxYear;
            setTimeout(() => this.initialized = true, 200);
            this.newYearsFilter([this.minYear, this.maxYear]);
        },
        updateYearWithDelay() {
            clearTimeout(this.delay);
            this.delay = setTimeout(() => {
                console.log('updateyears')
                this.newYearsFilter([this.minYearValue, this.maxYearValue]);
            }, 2000);
        }
    },
    watch: {
        minYearValue() {
            if (this.initialized)
                this.updateYearWithDelay();
        },
        maxYearValue() {
            if (this.initialized)
                this.updateYearWithDelay();
        }
    }
}
</script>
<style>
.range-clear {
    cursor: pointer;
    color:#b7bac3;
}
.range-values {
    top: 20px;
    font-size: 14px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-left: 3px;
}
.range-slider {
    position: relative;
    height: 55px;
}

.range-slider input[type="range"] {
    pointer-events: none;
    position: absolute;
    overflow: hidden;
    width: 100%;
    left: 0;
    top: 0;
    outline: none;
    height: 18px;
}

.range-slider input:last-of-type::-moz-range-track {
    -moz-appearance: none;
    background: none transparent;
    border: 0;
}

.range-slider input::-webkit-slider-thumb {
    pointer-events: all;
    position: relative;
    z-index: 1;
    outline: 0;
}

.range-slider input::-moz-range-thumb {
    pointer-events: all;
    position: relative;
    z-index: 10;
    -moz-appearance: none;
    width: 9px;
}

.range-slider input::-moz-range-track {
    position: relative;
    z-index: -1;
    background-color: rgba(0, 0, 0, 1);
    border: 0;
}

.range-slider input[type=range]::-moz-focus-outer {
  border: 0;
}
</style>