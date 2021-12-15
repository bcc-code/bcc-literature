<template>
    <section>
        <h4>{{ $t('search.year-filter') }}</h4>
        <div class="range-slider">
            <div class="range-wrap" :style="`--a: ${value1}; --b: ${value2}; --min: ${minYear}; --max: ${maxYear}`">
                <input v-model="value1" :min="minYear" :max="maxYear" step="1" type="range">
                <input v-model="value2" :min="minYear" :max="maxYear" step="1" type="range">
            </div>
            <p class="range-values">
                <span>{{minYearValue || '-' }}</span>
                <span v-if="minYearValue != minYear || maxYearValue != maxYear" @click="clear" class="range-clear">{{ $t('search.filters.clear') }}</span>
                <span>{{maxYearValue || '-' }}</span>
            </p>
        </div>
    </section>
</template>

<style>
.range-wrap {
    --dif: calc(var(--max) - var(--min));
    display: grid;
    grid-template: repeat(2, -webkit-max-content) 4em/1fr 1fr;
    grid-template: repeat(2, max-content) 4em/1fr 1fr;
    overflow: hidden;
    position: relative;
    height: 20px;
    background-color: var(--base5);
    border-radius: 17px;
    padding: 2px;
}
.range-wrap::before, .range-wrap::after {
    grid-column: 1/span 2;
    grid-row: 3;
    background: #6291eb;
    content: "";
    height: 4px;
    top: 6px;
    position: relative;
    z-index: 1;
}
.range-wrap::before {
    margin-left: calc(1em + (var(--a) - var(--min))/var(--dif) * calc(100% - 14px));
    width: calc((var(--b) - var(--a))/var(--dif) * calc(100% - 14px));
}
.range-wrap::after {
    margin-left: calc(1em + (var(--b) - var(--min))/var(--dif) * calc(100% - 14px));
    width: calc((var(--a) - var(--b))/var(--dif) * calc(100% - 14px));
}

input[type=range] {
	grid-column: 1/ span 2;
	grid-row: 3;
    z-index: 1;
    top: 0;
    left: 0;
    margin: 0;
    background: none; /* get rid of white Chrome background */
    --col: #000;
    pointer-events: none;
}
input[type=range]::-webkit-slider-runnable-track, input[type=range]::-webkit-slider-thumb, input[type=range] {
    -webkit-appearance: none;
}
input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 100%;
    background: none;
}
input[type=range]::-moz-range-track {
    width: 100%;
    height: 100%;
    background: none;
}
input[type=range]::-webkit-slider-thumb {
    border: 4px solid #fff;
    width: 16px;
    height: 16px;
    border-radius: 0; /* get rid of Firefox corner rounding */
    background: #6291EB;
    pointer-events: auto;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0px 2px 2px rgba(0, 35, 140, 0.06), 0px 4px 8px rgba(0, 7, 26, 0.06);
}
input[type=range]::-moz-range-thumb {
    border: 4px solid #fff;
    width: 16px;
    height: 16px;
    border-radius: 0; /* get rid of Firefox corner rounding */
    background: #6291EB;
    pointer-events: auto;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0px 2px 2px rgba(0, 35, 140, 0.06), 0px 4px 8px rgba(0, 7, 26, 0.06);
}

.range-clear {
    cursor: pointer;
    color: var(--main);
    font-size: 12px;
    font-style: italic;
}
.range-values {
    font-size: 14px;
    font-weight: 400;
    color: var(--base3);
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: relative;
    padding: 0 6px;
}
.range-slider {
    position: relative;
    height: 41px;
}
.range-slider:after {
    background-color: #C1C7DA;
    content: "";
    height: 4px;
    position: absolute;
    top: 8px;
    border-radius: 16px;
    left: 8px;
    right: 8px;
    pointer-events: none;
}
</style>

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
        this.initialized = false;
        let years = this.$store.state.search.searchParams.facets.Years;

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