<script setup lang="ts">
import type { Anime } from '@/stores/types'
import { defineProps } from 'vue'

defineProps<{
  anime?: Anime
  length?: number
  lastUpdate?: string
}>()
</script>

<template>
  <div>
    <div>
      <h1 class="text-[30px]">{{ anime?.names.ru }}</h1>
      <p>{{ anime?.names.en }}</p>
    </div>

    <div class="flex flex-row gap-3 text-gray-500 items-center text-[16px]">
      <span class="border-[1px] border-gray-500 rounded-[10px] px-2">{{
        anime?.status.string
      }}</span>
      <p class="w-[5px] h-[5px] rounded-full bg-gray-500"></p>
      <span>{{ anime?.season.year }}</span>
      <p class="w-[5px] h-[5px] rounded-full bg-gray-500"></p>
      <span>{{ anime?.type.string }}</span>
    </div>
    <ol class="flex flex-row gap-5 flex-wrap">
      <li>Жанры:</li>
      <li v-for="i in anime?.genres" :key="i">{{ i }}</li>
    </ol>
    <ol class="flex flex-row gap-5 flex-wrap">
      <li>Озвучка:</li>
      <li v-for="i in anime?.team.voice" :key="i">{{ i }}</li>
    </ol>
    <div>
      <span>Количество эпизодов: {{ length }}</span> из
      <span>{{ anime?.type?.episodes }}</span>
      <p>Последнее обновление: {{ lastUpdate }}</p>
    </div>
    <p>Описание: {{ anime?.description }}</p>
  </div>
</template>
