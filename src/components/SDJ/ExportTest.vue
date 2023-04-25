<template>
  <p>{{ name }}</p>
</template>

<script lang="ts">
export default {
  data() {},
  setup() {
    console.log('test')
  },
  methods: {},
  props: {
    name: {
      type: String,
      default: 'none'
    }
  }
}
</script>
