<template>
    <div class="img">
        <v-img :src="state.nowChecking.picture"></v-img>
    </div>
</template>

<script>
import AudioControl from '@/stores/AudioControl'
import { reactive } from 'vue'

export default ({
    // 現在右下角的圖片
    setup() {
        const state = reactive( AudioControl() )
        return { state }
    },
})
</script>


<style lang="scss" scoped>
.img{
    height: 30%;
    border-top: 1px rgb(222, 222, 222) solid;
}
</style>