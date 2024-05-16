<script setup lang="ts">
import { defineProps } from 'vue'
import type { Anime } from '@/stores/types'
import IconSprite from '../../../shared/IconSprite.vue';

defineProps<{
  anime: Anime[] | null
  hovered: Anime | null
}>()

const emit = defineEmits(['over', 'leave', 'push'])

const mouseOver = (e: Anime) =>{
  emit('over', e)
}
const mouseleave = (e: MouseEvent) =>{
  emit('leave', e)
}
const routerPushing = (e: Anime) => {
  emit('push', e)
}
</script>
<template>
  <article
    v-for="i in anime"
    :key="i"
    @click="routerPushing(i)"
    @mouseover="mouseOver(i)"
    @mouseleave="mouseleave(null)"
    class="flex flex-col items-center gap-3 cursor-pointer"
  >
    <div class="relative z-0 rounded-[15px] overflow-hidden">
      <img
        :src="`https://dl-20240330-7.anilib.moe${i.posters.original.url}`"
        class="w-full h-auto"
      />
      <div
        class="flex absolute z-10 top-0 left-0 w-full h-full duration-300 items-center justify-center text-transparent"
        :class="{ 'bg-cardOpacity text-white': hovered === i }"
      >
        <IconSprite :width="50" :height="50" name="icon-play" />
      </div>
    </div>
    <div class="flex flex-col items-center w-full">
      <h2
        class="font-medium w-full text-white duration-300 whitespace-nowrap text-ellipsis overflow-hidden"
        :class="{ 'text-red-500': hovered === i }"
      >
        {{ i.names.ru }}
      </h2>
      <p class="font-medium text-[#ccc7c7]">{{ i.season.year }}</p>
    </div>
  </article>
</template>
