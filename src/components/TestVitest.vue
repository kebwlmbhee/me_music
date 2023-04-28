<script setup>
import { computed, ref, toRefs } from 'vue'

const props = defineProps({
  count: Number
})

const times = ref(2)
const result = computed(() => props.count * times.value)

const { count } = toRefs(props)
</script>

<template>
  <div>{{ count }} x {{ times }} = {{ result }}</div>
  <!-- <button @click="times += 1">
        x1
    </button> -->
  <v-btn @click="times += 1" id="For_Vitest"> x1 </v-btn>
</template>
