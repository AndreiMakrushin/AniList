<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { API_anime } from '@/composables'
import { useRoute } from 'vue-router'
import axios from 'axios'
import type { Anime } from '@/stores/types'
import { VideoPlayer } from 'vue-hls-video-player'

const route = useRoute()
const anime = ref<Anime | null>(null)
onMounted(async () => {
  const res = await axios.get(`${API_anime}${route.params.id}`)
  console.log(res.data)
  return (anime.value = res.data)
})

const dataAnime = (data) => {
  const date = new Date(data * 1000)
  const year = date.getFullYear()
  const mounth = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  return `${day}.${mounth}.${year}`
}
const episodeAnime = ref<number>(1)
const quality = ref<string>('fhd')
const seria = computed(() => {
  return 'https://cache.libria.fun' + anime.value?.player?.list[episodeAnime.value]?.hls[quality.value]
})

watch(episodeAnime, () => {
  console.log(episodeAnime.value)
})

const updateEpisode = (event) => {
  episodeAnime.value = parseInt(event.target.value)
}
</script>

<template>
  <div class="w-[100%] flex flex-row gap-5">
    <div class="max-w-[300px] rounded-[10px] overflow-hidden">
      <img
        :src="anime ? `https://dl-20211030-963.anilib.top${anime?.posters.original.url}` : ''"
        alt=""
      />
    </div>
    <div class="w-[100%] flex flex-col gap-5">
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
      <ol class="flex flex-row gap-5">
        <li>Жанры:</li>
        <li v-for="i in anime?.genres" :key="i">{{ i }}</li>
      </ol>
      <ol class="flex flex-row gap-5">
        <li>Озвучка:</li>
        <li v-for="i in anime?.team.voice" :key="i">{{ i }}</li>
      </ol>
      <div>
        <span>Количество эпизодов: {{ anime?.player.episodes.first }}</span> из
        <span>{{ anime?.player.episodes.last }}</span>
        <p>Последнее обновление: {{ dataAnime(anime?.updated) }}</p>
      </div>
      <p>Описание: {{ anime?.description }}</p>

      <div class="mb-[600px]">
        <select @change="updateEpisode">
          <option v-for="i in anime?.player.list" :key="i">{{ i.episode }}</option>
        </select>
        <VideoPlayer
          type="default"
          :isControls="true"
          :previewImageLink="'https://dl-20211030-963.anilib.top' + anime?.player?.list[episodeAnime]?.preview"
          :link="anime ? seria : ''"
        />
      </div>
    </div>
  </div>
</template>
