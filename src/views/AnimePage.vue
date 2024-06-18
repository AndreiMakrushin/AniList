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
import Input from '../shared/ui/Input.vue'
import Button from '../shared/ui/Button.vue'
import Avatar from '../shared/ui/Avatar.vue'

const Player = defineAsyncComponent(() => import('@/widgets/player/Player.vue'))

const animeStore = useAnimeStore()

const route = useRoute()
const router = useRouter()
const anime = ref<Anime | null>(null)
const similarAnime = ref<Anime[] | null>(null)
const hovered = ref<Anime[] | null>(null)
const commentary = ref<string>('')

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
  await addCommentaries()
})

watch(route, async () => {
  await loadAnime()
  await addCommentaries()
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

const sendCommentary = async () => {
  try {
    const { data, error } = await supabase.from('animeCommentaries').insert({
      animeId: anime.value?.id,
      userId: animeStore.user?.id,
      userName: animeStore.user?.name,
      img: animeStore.user?.avatar_url,
      commentary: commentary.value,
      parentId: Math.floor(Math.random() * 1000000000000000000)
    })
    if (error) {
      return console.log('ошибка:', error.message)
    } else {
      return data
    }
  } catch (error) {
    console.log('ошибка:', error)
  }
}

const commentArray = ref<Array<any>>([])

supabase
  .channel('animeCommentaries')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'animeCommentaries' },
    (payload: any) => {
      console.log(payload)
    }
  )
  .subscribe()

async function addCommentaries() {
  try {
    const { data, error } = await supabase
      .from('animeCommentaries')
      .select()
      .filter('animeId', 'eq', anime.value?.id)
    if (error) {
      console.log('ошибка:', error)
    }
    console.log(data)
    commentArray.value = data
  } catch (error) {
    console.log('ошибка:', error)
  }
}

const replyToMessage = async (answerUserId: number, answerUserName: string, commentId: number) => {
  const { data, error } = await supabase
    .from('animeCommentaries')
    .select()
    .filter('parentId', 'eq', commentId)
    .single()
  console.log(commentId)
  console.log(data)
  console.log(error)
  try {
    const { data, error } = await supabase.from('animeCommentaries').insert({
      animeId: anime.value?.id,
      commentary: `${answerUserName + ': ' + commentary.value}`,
      userId: answerUserId,
      img: animeStore.user?.avatar_url,
      userName: answerUserName,
      parentId: commentId,
      answerId: animeStore.user?.id,
      answerName: animeStore.user?.name,
      childrenId: Math.floor(Math.random() * 1000000000000000000)
    })

    if (error) {
      return console.log('ошибка:', error.message)
    } else {
      console.log(data)
    }
  } catch (error) {
    console.log('ошибка:', error)
  }
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

      <div class="flex flex-col gap-5 bg-slate-600 p-3 rounded-[10px]">
        <span>Коментарии</span>
        <div
          class="flex flex-col gap-2"
          v-for="i in commentArray.filter((item) => item.childrenId === null)"
          :key="i"
        >
          <div class="flex flex-row gap-3">
            <div class="flex flex-col justify-center items-center">
              <Avatar :img="i.img" :style="'w-[50px] h-[50px]'" />
              <span>{{ i.userName }}</span>
            </div>
            <div class="flex flex-col grow border-b-[1px] border-white justify-between">
              <span>{{ i.commentary }}</span>
              <div class="flex justify-end" v-if="animeStore?.user">
                <span
                  class="text-[15px] self-end cursor-pointer"
                  @click="replyToMessage(i.userId, i.userName, i.parentId)"
                  >Ответить</span
                >
              </div>
            </div>
          </div>
          <div
            class="pl-[10%] flex flex-row gap-3 justify-center items-center"
            v-for="j in commentArray.filter(
              (item) => item.childrenId !== null && item.parentId === i.parentId
            )"
            :key="j"
          >
            <div class="flex flex-col justify-center items-center">
              <Avatar :img="animeStore?.user?.avatar_url" :style="'w-[30px] h-[30px]'" />
              <span>{{ j.userName }}</span>
            </div>
            <div class="flex flex-col grow justify-between">
              <span>{{ j.commentary }}</span>
              <div class="flex justify-end">
                <span
                  class="text-[15px] self-end cursor-pointer"
                  @click="replyToMessage(j.userId, j.userName, i.parentId)"
                  >Ответить</span
                >
              </div>
            </div>
          </div>
        </div>
        <span class="m-auto" v-if="commentArray.length === 0"
          >Пока комментариев нет, будь одним из первых и напиши свой комментарий!</span
        >
        <div class="flex flex-col gap-3 items-start" v-if="animeStore?.user">
          <span>Напиши отзыв!</span>
          <div class="flex flex-row w-full grow gap-3 items-center">
            <div class="flex flex-col justify-center items-center">
              <Avatar :img="animeStore?.user?.avatar_url" :style="'w-[50px] h-[50px]'" />
              <span>{{ animeStore?.user?.name }}</span>
            </div>
            <Input
              :style="'text-black'"
              v-model="commentary"
              placeholder="Комментарий"
              type="text"
            />
          </div>
          <Button
            @click="sendCommentary"
            text="Отправить"
            :style="'hover:shadow-shadowDrop p-1 hover:bg-slate-500 rounded-[15px]'"
          />
        </div>
      </div>
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
