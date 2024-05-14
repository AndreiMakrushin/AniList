<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { API_anime, API_SIMILAR_ANIME } from '@/composables'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import type { Anime } from '@/stores/types'
import Player from '@/widgets/player/Player.vue'
import IconSprite from '../shared/IconSprite.vue'
import { useAnimeStore } from '../stores/animeStore'
import SkeletonAnimePage from '../shared/ui/skeleton/SkeletonAnimePage.vue'

const animeStore = useAnimeStore()

const route = useRoute()
const router = useRouter()
const anime = ref<Anime | null>(null)
const similarAnime = ref<Anime[] | null>(null)
const hovered = ref<Anime[] | null>(null)

const loadAnime = async () => {
  const res = await axios.get(`${API_anime}${route.params.id}`)
  /* важный лог */
  console.log(res.data)
  anime.value = res.data
  const genres = Object.values(res.data.genres).join(',')
  const similar = await axios.get(`${API_SIMILAR_ANIME}${genres}&limit=10`)
  similarAnime.value = similar.data.list.slice(1)
}

onMounted(async () => {
  await loadAnime()
})

watch(route, async () => {
  await loadAnime()
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
  <div v-show="anime" class="w-[100%] flex flex-row gap-0 md:gap-5 p-3 text-white text-[20px]">
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
  <!-- раздекомпозировать верстку -->
  <span class="text-[20px] text-white text-center font-medium">Похожие Аниме</span>
  <div class="grid gap-[30px] p-[20px] md:grid-cols-4 sm:grid-cols-3 grid-cols-2">
    <article
      v-for="i in similarAnime"
      :key="i"
      @click="router.push({ name: 'anime', params: { id: i.id, episode: '1' } })"
      @mouseover="hovered = i"
      @mouseleave="hovered = null"
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
  </div>
</template>
