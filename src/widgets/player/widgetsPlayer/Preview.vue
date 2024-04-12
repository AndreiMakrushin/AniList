<script setup lang="ts">
import IconSprite from '@/shared/IconSprite.vue'
import {defineProps} from 'vue'
import noImg from '@/assets/img/noimg.jpeg'

interface PreviewProps {
  previewAnime?: string
}

const props = defineProps<PreviewProps>()

console.log(props.previewAnime);
</script>

<template>
 <div class="absolute w-full"  >
      <img :src="!'https://dl-20211030-963.anilib.topundefined' ? props.previewAnime : noImg" class="w-full rounded-[10px]" />
      <IconSprite
        name="icon-play"
        :width="50"
        :height="50"
        class="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-white cursor-pointer"
      />
    </div>
</template>

