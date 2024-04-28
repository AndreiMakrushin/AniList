<script setup lang="ts">
import IconSprite from '@/shared/IconSprite.vue'
import {defineProps} from 'vue'

type PreviewProps =  {
  previewAnime?: string
}

const props = defineProps<PreviewProps>()

</script>

<template>
 <div class="w-full"  >
      <img :src="previewAnime" class="w-full rounded-[10px]" />
      <IconSprite
        name="icon-play"
        :width="50"
        :height="50"
        class="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-white cursor-pointer"
      />
    </div>
</template>

