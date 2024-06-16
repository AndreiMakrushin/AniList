<script setup lang="ts">
import { useAnimeStore } from '@/stores/animeStore'
import Profile from '@/widgets/profile/Profile.vue'
import { supabase } from '@/supabase'
import { computed, onMounted, ref, watch } from 'vue'
import type { addAnime, AnimeStatus } from '@/stores/types'
import { useRouter, useRoute } from 'vue-router'
import noimg from '@/assets/img/noAnime.png'
import DropDown from '../shared/ui/DropDown.vue'
import HistoryAnime from '@/widgets/profile/HistoryAnime.vue'
import AnimeStatuses from '@/widgets/profile/AnimeStatuses.vue'

const router = useRouter()
const route = useRoute()
const animeStore = useAnimeStore()

const aniHistory = ref<addAnime>(null)
const animeStatus = ref<AnimeStatus>([])
const isHistory = ref<boolean>(true)
const status = computed(() => {
  return routeParamsStatus()
})
const deleteAvatar = async () => {
  await supabase.from('users').update({ avatar_url: null }).match({ id: route.params.id })
}

function routeParamsStatus() {
  return route.params.status as string
}
const historyValue = () => {
  if (status.value === 'История просмотра') {
    isHistory.value = true
  } else {
    isHistory.value = false
  }
}

watch(route, () => {
  routeParamsStatus()
  historyValue()
})

const getAnime = async () => {
  const { data } = await supabase.from('animeUserList').select().eq('userId', route.params.id)
  aniHistory.value = data

  data.reduce((acc) => {
    acc.push({
      animeId: 0,
      created_at: '',
      id: 0,
      img: '',
      nameAnime: '',
      status: 'История просмотра',
      userId: animeStore.user.id
    })
    return acc
  }, animeStatus.value)
}
const getStatusesAnime = async () => {
  const { data } = await supabase.from('animeStatusList').select().eq('userId', route.params.id)
  animeStatus.value.push(...data)
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
  historyValue()
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
  'История просмотра',
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

const filterList = (key: string) => {
  if (key === 'История просмотра') return null
  return animeStatus.value.filter((item: AnimeStatus) => item.status === key)
}

const animePush = (e: Event) => {
  router.push({ name: 'anime', params: { id: e.id, episode: e.episode } })
}
const statusPush = (e: Event) => {
  router.push({ name: 'lk', params: { id: animeStore?.user?.id, status: e } })
}
</script>

<template>
  <div class="flex flex-col w-[100%] justify-center items-center mt-3">
    <Profile
      :user="animeStore?.user?.id === Number(route.params.id) ? animeStore.user : null"
      @loadAvatar="animeStore.modal = $event"
      @deleteAvatar="deleteAvatar()"
      :statusAnime="statusAnime"
      :labelStatus="labelStatus"
      :history="reverceAnime"
    />
    <div class="flex flex-col gap-5 mt-10 w-[80%] sm:w-[60%]">
      <DropDown
        :status="labelStatus"
        :header="!status ? 'Аниме список' : status"
        @sendStatus="statusPush($event)"
      />

      <HistoryAnime
        @pushing="animePush($event)"
        :anime="reverceAnime"
        :img="noimg"
        v-if="isHistory"
      />
      <AnimeStatuses
        v-if="!isHistory"
        @pushing="animePush($event)"
        :filterList="filterList"
        :labelStatus="labelStatus"
        :noimg="noimg"
        :status="route.params.status"
      />
    </div>
  </div>
</template>
