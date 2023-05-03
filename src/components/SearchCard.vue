<template>
  <v-card variant="outlined" @click="clickCard">
    <div class="d-flex flex-no-wrap justify-start">
      <v-avatar rounded="0" size="72">
        <v-img :src="imgSrc"></v-img>
      </v-avatar>
      <div>
        <v-card-title>{{ Name }}</v-card-title>
        <v-card-subtitle>{{ artist }}</v-card-subtitle>
      </div>
      <v-spacer></v-spacer>
      <v-card-actions v-if="type === 'track'">
        <v-btn icon="mdi-play"></v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    Name: String,
    imgSrc: String,
    artist: String,
    id: String,
    type: String
  },
  methods: {
    clickCard() {
      if (this.type === 'track') return
      this.$router.push({
        path: '/Home/ExploreSong',
        query: { id: this.id, type: this.type }
      })
    }
  }
}
</script>

<style scoped></style>
