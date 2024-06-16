<script setup lang="ts">
import { defineProps } from 'vue'
import type { addAnime } from '@/stores/types'

const emit = defineEmits(['pushing'])

const props = defineProps<{
  img: string | null
  anime?: addAnime | null
}>()

const pusing = (id: number, episode: number) =>{
  emit('pushing', {id: id, episode: episode})
}
</script>

<template>
  <div class="flex flex-col gap-5 mb-[30px]">
    <span class="text-white text-[18px]">История просмотра</span>
    <div
      v-for="i in props.anime"
      :key="i"
      class="relative cursor-pointer flex gap-5 rounded-[10px] overflow-hidden max-h-[44 0px]"
      @click="pusing(i.animeId, i.episode)"
    >
      <img :src="i.img === null ? props.img : i.img" alt="" class="w-[100%] object-contain" />
      <div class="absolute bottom-0 left-0 flex flex-col bg-white w-[100%]">
        <div class="relative flex">
          <span class="w-full flex h-[5px] bg-slate-300"></span>
          <span
            class="h-[5px] bg-red-500 absolute top-0 left-0"
            :style="`width: ${(i.current_Time / i.duration_Time) * 100}%`"
          ></span>
        </div>
        <div class="px-2">
          <h1 class="text-[18px] w-full whitespace-nowrap text-ellipsis overflow-hidden">
            {{ i.nameAnime }}
          </h1>
          <h3>Серия: {{ i.episode }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>
