<script setup lang="ts">
import { useAnimeStore } from '@/stores/animeStore'
import Profile from '@/widgets/profile/Profile.vue'
import { supabase } from '@/supabase'
import { computed, onMounted, ref, watch } from 'vue'
import type { addAnime, AnimeStatus } from '@/stores/types'
import { useRouter, useRoute } from 'vue-router'
import noimg from '@/assets/img/noimg.jpeg'
import Swiper from '@/shared/ui/Swiper.vue'

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
    .sort((a: addAnime, b: addAnime) => {
      const dateA = new Date(a.updated)
      const dateB = new Date(b.updated)
      return dateB.getTime() - dateA.getTime()
    })
})

const labelStatus = [
  'Смотрю',
  'Просмотрено',
  'Запланировано',
  'Пересматриваю',
  'Выходит',
  'Заброшено'
]

const statusAnime = computed<AnimeStatus>(() => {
  if (!animeStatus.value?.length) {
    return {}
  }
  return animeStatus.value.reduce((acc: AnimeStatus, obj: AnimeStatus) => {
    if (acc[obj.status]) {
      return { ...acc, [obj.status]: acc[obj.status] + 1 }
    }
    return { ...acc, [obj.status]: 1 }
  }, {})
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
          <!-- <li>История - {{ reverceAnime?.length }}</li> -->
          <li v-for="item in labelStatus" :key="item">{{ item }} - {{ statusAnime[item] || 0 }}</li>
        </ol>
      </div>
      <Swiper
        :history="reverceAnime"
        :labelStatus="labelStatus"
        :list="animeStatus"
        @pushing="
          router.push({ name: 'anime', params: { id: $event.id, episode: $event.episode } })
        "
      />
    </div>
  </div>
</template>
