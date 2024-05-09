<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { API_anime } from '@/composables'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import type { Anime } from '@/stores/types'
import Player from '@/widgets/player/Player.vue'
import SkeletonAnimePage from './../shared/ui/skeleton/SkeletonAnimePage.vue'
import { useAnimeStore } from '../stores/animeStore'

const animeStore = useAnimeStore()

const route = useRoute()
const router = useRouter()
const anime = ref<Anime | null>(null)
onMounted(async () => {
  const res = await axios.get(`${API_anime}${route.params.id}`)
  console.log(res.data)
  return (anime.value = res.data)
})

const dataAnime = (data: number) => {
  const date = new Date(data * 1000)
  const year = date.getFullYear()
  const mounth = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  return `${day}.${mounth}.${year}`
}
const animeLength = computed(() => {
  return anime.value ? Object.keys(anime.value?.player?.list).length : 0
})
</script>

<template>
  <SkeletonAnimePage v-if="!anime" />
  <div v-else class="w-[100%] flex flex-row gap-0 md:gap-5 p-3 text-white text-[20px]">
    <div class="max-w-[300px] h-full rounded-[10px] overflow-hidden">
      <img
        class="hidden md:block"
        :src="anime ? `https://dl-20211030-963.anilib.top${anime?.posters.original.url}` : ''"
        alt=""
      />
    </div>
    <div class="w-[100%] flex flex-col gap-5 p-[10px] mb-2">
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
        <span>Количество эпизодов: {{ animeLength }}</span> из
        <span>{{ anime?.type?.episodes }}</span>
        <p>Последнее обновление: {{ dataAnime(anime?.updated) }}</p>
      </div>
      <p>Описание: {{ anime?.description }}</p>

      <Player
        :user="animeStore?.user"
        :AnimePlay="anime?.player"
        :animeName="anime?.names.ru"
        :animeId="anime?.id"
        :episode="Number(route.params.episode)"
        @updateEpisode="router.push({ name: 'anime', params: { id: anime?.id, episode: $event } })"
      />
    </div>
  </div>
</template>
