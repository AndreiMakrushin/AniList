<script setup lang="ts">
import { computed, onMounted, ref, watch, defineAsyncComponent, reactive } from 'vue'
import { API_anime, API_SIMILAR_ANIME } from '@/composables'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import type { Anime } from '@/stores/types'
import { useAnimeStore } from '../stores/animeStore'
import SkeletonAnimePage from '../shared/ui/skeleton/SkeletonAnimePage.vue'
import CardsCatalog from '../widgets/catalog/widgetsCatalog/CardsCatalog.vue'
import Card from '../widgets/catalog/widgetsCatalog/Card.vue'
import DropDown from './../shared/ui/DropDown.vue'
import { addStatusAnime } from '../features/addStatusAnime/addStatusAnime'
import { supabase } from '../supabase'
import Content from './../widgets/anime-page-content/Content.vue'
import { upScroll } from '../features/upScroll/upScroll'
import CommentsSection from '../widgets/commentaries/CommentsSection.vue'

const Player = defineAsyncComponent(() => import('@/widgets/player/Player.vue'))

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
  const similar = await axios.get(`${API_SIMILAR_ANIME}${genres}&limit=20`)
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

const statuses = reactive([
  'Просмотрено',
  'Смотрю',
  'Запланировано',
  'Пересматриваю',
  'Выходит',
  'Заброшено'
])
const sendStatus = async (status: string) => {
  const { data } = await supabase
    .from('animeStatusList')
    .select()
    .filter('animeId', 'eq', anime.value?.id)
    .filter('userId', 'eq', animeStore.user?.id)
    .single()

  if (data) {
    console.log('уже есть')
    return
  }

  const animeStatus = {
    animeId: anime.value?.id,
    userId: animeStore.user?.id,
    nameAnime: anime.value?.names.ru,
    img: anime.value?.posters.original.url,
    status: status
  }

  addStatusAnime(animeStatus)
}


</script>

<template>
  <SkeletonAnimePage v-if="!anime" />
  <div v-show="anime" class="w-[100%] flex flex-row gap-0 md:gap-5 p-3 text-white text-[20px]">
    <div class="max-w-[300px] h-full flex flex-col gap-5">
      <img
        class="hidden md:block rounded-[10px]"
        :src="anime ? `https://dl-20211030-963.anilib.top${anime?.posters.original.url}` : ''"
        alt=""
      />
      <DropDown
        class="hidden md:block"
        v-if="animeStore?.user"
        :status="statuses"
        header="Добавить в список"
        @sendStatus="sendStatus($event)"
      />
    </div>
    <div class="w-[100%] h-full flex flex-col gap-5 p-[10px] mb-2">
      <Content :anime="anime" :length="animeLength" :lastUpdate="dataAnime(anime?.updated)" />
      <Player
        :user="animeStore?.user"
        :previewUrl="'https://dl-20211030-963.anilib.top'"
        :seriaUrl="'https://cache.libria.fun'"
        :AnimePlay="anime?.player"
        :animeName="anime?.names.ru"
        :animeId="anime?.id"
        :episode="Number(route.params.episode)"
        @updateEpisode="router.push({ name: 'anime', params: { id: anime?.id, episode: $event } })"
      />
      <DropDown
        class="max-md:block hidden mt-2"
        v-if="animeStore?.user"
        :status="statuses"
        header="Добавить в список"
        @sendStatus="sendStatus($event)"
      />
      <CommentsSection :anime="anime?.id" :animeStore="animeStore?.user"/>
    </div>
  </div>

  <span class="text-[20px] text-white text-center font-medium">Похожие Аниме</span>
  <CardsCatalog>
    <Card
      :anime="similarAnime"
      :hovered="hovered"
      @over="hovered = $event"
      @leave="hovered = null"
      @push="router.push({ name: 'anime', params: { id: $event.id, episode: '1' } }), upScroll()"
    />
  </CardsCatalog>
</template>
