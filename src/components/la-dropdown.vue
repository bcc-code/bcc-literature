<template>
      <section v-click-outside="() => show = false" class="dropdown left-down">
			<button @click='show = !show' class="dropdown-button">
                {{buttonText}}
            </button>
			<section class="custom-select" :class="{ show: show }">
				<h6>{{innerText}}</h6>
				<ul>		
                    <li v-if="defaultValue != null" @click="$emit('click', null)" value="">{{defaultValue}}</li>
                    <li v-for="option in options" 
                    :key="option.value"
                    v-bind:value="option.value"
                    @click="$emit('click', option.value); show = false">
                        {{option.title}}
                    </li>
				</ul>
			</section>
		</section>
</template>

<script>
export default {
    props: ['options', 'buttonText', 'innerText', 'defaultValue'],
    data() {
        return {
            show: false,
        }
    }
}
</script>