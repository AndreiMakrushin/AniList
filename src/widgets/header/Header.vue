<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { API_search } from '@/composables'
import axios from 'axios'
import { RouterLink, useRouter } from 'vue-router'
import { useAnimeStore } from '@/stores/animeStore'
import type { Anime } from '@/stores/types'
import ModalMenu from '@/widgets/modals/popupButtonAvatar/ModalMenu.vue'
import SvgButton from '@/widgets/modals/popupButtonAvatar/SvgButton.vue'
import IconSprite from '@/shared/IconSprite.vue'
import Avatar from '@/shared/ui/Avatar.vue'
import Search from '@/shared/ui/Search.vue'
import Switch from '../../shared/ui/Switch.vue'
import Button from '@/shared/ui/Button.vue'
import AnimeOnDemand from './anime-on-demand/AnimeOnDemand.vue'


const router = useRouter()
const animeStore = useAnimeStore()

const modalMenu = ref<boolean>(false)
const mobie = ref<boolean>(false)
const searchAnime = ref<string>('')
const arrayAnime = ref<Anime>(null)

const animeSearch = async () => {
  const responce = await axios.get(`${API_search}${searchAnime.value}`)
  return (arrayAnime.value = responce.data.list)
}

watch(searchAnime, async () => {
  if (searchAnime.value.length > 3) {
    animeSearch()
  }else{
    arrayAnime.value = null
  }
})
const mobileScreen = () => {
  window.innerWidth < 550 ? (mobie.value = true) : (mobie.value = false)
}

onresize = () => {
  mobileScreen()
}
onMounted(() => {
  mobileScreen()
})
const pushAnime = (id: number) => {
  router.push({ name: 'anime', params: { id: id, episode: '1' } })
  searchAnime.value = ''
}
</script>

<template>
  <header class="flex w-[100%] relative">
    <div class="flex flex-col w-full">
      <div class="justify-between items-center flex px-4 py-2 w-full">
        <div class="flex flex-row gap-4 w-[60%]">
          <span
            class="text-[20px] font-medium cursor-pointer text-white hover:text-red-500 duration-short"
            @click="router.push('/')"
            >AniList</span
          >
          <div v-if="!mobie" class="relative flex flex-row grow gap-5">
            <Search
              type="text"
              :class="'focus:ring-cyan-300 bg-[#d8d8d8]'"
              v-model="searchAnime"
              :modelValue="searchAnime"
            />
            <AnimeOnDemand @pushing="pushAnime($event)" :arrayAnime="arrayAnime" v-if="arrayAnime"/>
          </div>
        </div>
        <main class="flex flex-row items-center gap-5">
          <Switch />
          <Avatar
            v-if="animeStore.user"
            :style="'w-[32px] h-[32px]'"
            :img="animeStore.user.avatar_url"
            @click="modalMenu = !modalMenu"
          />
          <Button
            v-if="!animeStore.user"
            @click="animeStore.authRegModal = true"
            text="Войти"
            :style="'p-0 font-medium text-gray-500'"
          />
        </main>
      </div>
      <div v-if="mobie" class="relative flex flex-row grow gap-5 px-[16px] h-[30px]">
        <Search
          type="text"
          :class="'focus:ring-cyan-300 bg-[#d8d8d8]'"
          v-model="searchAnime"
          :modelValue="searchAnime"
        />
        <AnimeOnDemand @pushing="pushAnime($event)" :arrayAnime="arrayAnime" v-if="arrayAnime"/>
      </div>
    </div>
    <ModalMenu v-if="modalMenu" @click="modalMenu = false" :style="'right-[20px] top-[100%]'">
      <SvgButton>
        <IconSprite name="icon-user" />
        <span class="text-[14px]">{{ animeStore.user?.name }}</span>
      </SvgButton>
      <SvgButton class="cursor-pointer">
        <IconSprite name="icon-settings" />
        <span class="text-[14px]" @click="router.push(`/lk/${animeStore.user?.id}/История просмотра`)"
          >Мой Профиль</span
        >
      </SvgButton>
      <SvgButton class="cursor-pointer">
        <IconSprite name="exit" />
        <span class="text-[14px]" @click="animeStore.logout">Выйти</span>
      </SvgButton>
    </ModalMenu>
  </header>
</template>
