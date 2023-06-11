<template>
  <html>
    <h1>test</h1>
    {{
      list[0].make
    }}
    <span style="width: 200px; height: 500px"
      ><v-btn @click="test" width="100px" height="100px">test</v-btn></span
    ><br />
    test
  </html>
</template>

<!-- 
need to give it a root html -->
<script>
import { reactive } from 'vue'
export default {
  created() {},
  data() {},
  methods: {},

  // !! setup 無法和vue2一起使用 會讀不到data
  setup() {
    var list = reactive([
      {
        make: 'OK',
        model: 'OK',
        year: 'OK'
      }
    ])

    for (let i = 0; i < 5; ++i) {
      list.value.push({ make: 'a', model: 'b', year: 'c' })
    }

    function test() {
      alert('test')
    }

    return { list, test }
  }
}
</script>

<style scoped>
html {
  font-size: 10px;
}
h1 {
  font-size: 2em;
}

@media (min-width: 1600px) {
  html {
    font-size: 30px;
  }
  h1 {
    font-size: 2em;
  }
}
</style>
