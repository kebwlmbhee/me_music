<template>
  <v-card class="cardHover mx-5 my-2" width="125" min-width="100" flat>
    <v-img :src="imgSrc">.</v-img>
    <div class="DescriptionText font-weight-bold">
      {{ playlistName }}
    </div>
    <div class="DescriptionText">
      {{ description }}
    </div>
    <v-tooltip activator="parent" location="start">
      {{ playlistName }}
    </v-tooltip>
  </v-card>
</template>

<script>
export default {
  props: {
    playlistName: String,
    description: String,
    imgSrc: String,
    playlistTracks: String
  }
}
</script>

<style>
.DescriptionText {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
}
</style>
