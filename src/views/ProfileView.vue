<script setup lang="ts">
import { useAnimeStore } from '@/stores/animeStore'
import Profile from '@/widgets/profile/Profile.vue'
import { supabase } from '@/supabase'
import { computed, onMounted, onUnmounted, onUpdated, ref, watch } from 'vue'
import type { addAnime, AnimeStatus } from '@/stores/types'
import { useRouter, useRoute } from 'vue-router'
import noimg from '@/assets/img/noimg.jpeg'

const router = useRouter()
const route = useRoute()
const animeStore = useAnimeStore()

const aniHistory = ref<addAnime>(null)
const animeStatus = ref<AnimeStatus>(null)
const deleteAvatar = async () => {
  await supabase.from('users').update({ avatar_url: null }).match({ id: route.params.id })
}
const getAnime = async () => {
  const { data } = await supabase.from('animeUserList').select().eq('userId', route.params.id)
  aniHistory.value = data
}
const getStatusesAnime = async () => {
  const { data } = await supabase.from('animeStatusList').select().eq('userId', route.params.id)
  animeStatus.value = data
}
let timeout: any
const checkAuthorization = async () => {
  if (!animeStore.user || animeStore.user.id.toString() !== route.params.id) {
    timeout = setTimeout(async () => {
      router.push('/')
    }, 3000)
    return
  }
  await getAnime()
  await getStatusesAnime()
}

onMounted(async () => {
  await checkAuthorization()
})

watch(
  () => animeStore.user,
  async () => {
    clearTimeout(timeout)
    await checkAuthorization()
  }
)

const reverceAnime = computed<addAnime>(() => {
  return aniHistory.value
    ?.filter((item: addAnime) => item.updated !== null)
    .sort((a: addAnime, b: addAnime) => new Date(b.updated) - new Date(a.updated))
})

const statusAnime = computed<AnimeStatus>(() => {
  if (!animeStatus.value || !animeStatus.value.length) return {}
  return animeStatus.value.reduce((acc: AnimeStatus, obj: AnimeStatus) => {
    if (acc[obj.status]) {
      return Object.assign(acc, { [obj.status]: acc[obj.status] + 1 })
    }
    return Object.assign(acc, { [obj.status]: 1 })
  }, {})
})
onUnmounted(() => {
  animeStore.animeEpisode = 1
})
</script>

<template>
  <div class="flex flex-col w-[100%] justify-center items-center mt-3">
    <Profile
      :user="animeStore?.user?.id === Number(route.params.id) ? animeStore.user : null"
      @loadAvatar="animeStore.modal = $event"
      @deleteAvatar="deleteAvatar()"
      :statusAnime="null"
    />
    <div class="flex flex-col gap-5 mt-10 w-[80%] sm:w-[60%]">
      <div v-if="animeStore?.user">
        <ol class="flex flex-row gap-3 text-white flex-wrap text-[18px]">
          <li>История - {{ reverceAnime?.length }}</li>
          <li>Смотрю - {{ statusAnime['Смотрю'] || 0}}</li>
          <li>Просмотрено - {{ statusAnime['Просмотрено'] || 0}}</li>
          <li>Запланировано - {{ statusAnime['Запланировано'] || 0}}</li>
          <li>Пересматриваю - {{ statusAnime['Пересматриваю'] || 0}}</li>
          <li>Выходит - {{ statusAnime['Выходит'] || 0}}</li>
          <li>Заброшено - {{ statusAnime['Заброшено'] || 0 }}</li>
        </ol>
      </div>
      <div
        v-for="i in reverceAnime"
        :key="i"
        class="relative cursor-pointer flex gap-5 rounded-[10px] overflow-hidden"
        @click="router.push({ name: 'anime', params: { id: i.animeId, episode: i.episode } })"
      >
        <img :src="i.img === null ? noimg : i.img" alt="" class="w-[100%]" />
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
  </div>
</template>

<style scoped></style>
/* @click="router.push(`/anime/${i.animeId}`), (animeStore.animeEpisode = i.episode)" */
