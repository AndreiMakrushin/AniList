<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAnimeStore } from '@/stores/animeStore'
import ModalMenu from '@/widgets/modals/popupButtonAvatar/ModalMenu.vue'
import SvgButton from '@/widgets/modals/popupButtonAvatar/SvgButton.vue'
import IconSprite from '@/shared/IconSprite.vue'
import Avatar from '@/shared/ui/Avatar.vue'
import Search from '@/shared/ui/Search.vue'
import Switch from './Switch.vue'
import Button from '@/shared/ui/Button.vue'

const router = useRouter()
const animeStore = useAnimeStore()

const modalMenu = ref<boolean>(false)

const mobie = ref<boolean>(false)

const mobileScreen = () => {
  window.innerWidth < 550 ? (mobie.value = true) : (mobie.value = false)
}

onresize = () => {
  mobileScreen()
}
onMounted(() => {
  mobileScreen()
})
</script>

<template>
  <header class="flex w-[100%] relative">
    <div class="justify-between items-center flex px-4 py-2 w-full">
      <div class="flex flex-row gap-4 w-[60%]">
        <span class="items-center flex" v-if="mobie">&#x2630;</span>
        <span
          class="text-[20px] font-medium cursor-pointer hover:text-red-500 duration-short"
          @click="router.push('/')"
          >AniList</span
        >
        <div v-if="!mobie" class="flex flex-row grow gap-5">
          <Search type="text" :class="'focus:ring-cyan-300 bg-[#d8d8d8]'" />
          <Button
            text="Поиск"
            :style="'py-0 font-medium text-gray-500 hover:shadow-shadowDrop hover:ring-[1px] hover:ring-cyan-300 px-3 rounded-[15px]'"
          />
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
    <ModalMenu v-if="modalMenu" @click="modalMenu = false" :style="'right-[20px] top-[100%]'">
      <SvgButton>
        <IconSprite name="icon-user" />
        <span class="text-[14px]">{{ animeStore.user?.name }}</span>
      </SvgButton>
      <SvgButton class="cursor-pointer">
        <IconSprite name="icon-settings" />
        <span class="text-[14px]" @click="router.push('/profile')">Мой Профиль</span>
      </SvgButton>
      <SvgButton class="cursor-pointer">
        <IconSprite name="exit" />
        <span class="text-[14px]" @click="animeStore.logout">Выйти</span>
      </SvgButton>
    </ModalMenu>
  </header>
</template>
