<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAnimeStore } from '@/stores/animeStore'
import { supabase } from '@/supabase'
import ModalMenu from '@/widgets/modals/popupButtonAvatar/ModalMenu.vue'
import SvgButton from '@/widgets/modals/popupButtonAvatar/SvgButton.vue'
import IconSprite from '@/shared/IconSprite.vue'
import Avatar from '@/shared/ui/Avatar.vue'

const router = useRouter()
const animeStore = useAnimeStore()

const modalMenu = ref<boolean>(false)
const deleteAvatar = async () => {
  await supabase.from('users').update({ avatar_url: null }).match({ id: animeStore.user.id })
}
</script>

<template>
  <header class="fixed top-0 w-[100%] bg-slate-400">
    <div class="justify-between items-center px-4 py-2 flex">
      <div class="flex flex-row gap-5 w-[50%]">
        <span class="text-[20px] font-medium" @click="router.push('/')">AniList</span>
        <input
          type="text"
          class="flex grow font-normal text-[15px] pl-[10px] rounded-[5px] outline-none focus:ring-[1px] focus:ring-red-500"
        />
      </div>
      <nav class="flex flex-row gap-3 text-[14px]">
        <RouterLink to="/" active-class="active">Home</RouterLink>
        <RouterLink to="/about" active-class="active">About</RouterLink>
      </nav>
      <main class="flex flex-row items-center gap-5" v-if="animeStore.user">
        <Avatar
          :style="'w-[32px] h-[32px]'"
          :img="animeStore.user.avatar_url"
          @click="modalMenu = !modalMenu"
        />
      </main>
    </div>
    <ModalMenu v-if="modalMenu" @click="modalMenu = false">
      <SvgButton>
        <IconSprite name="icon-user" />
        <span class="text-[14px] cursor-pointer">{{ animeStore.user?.name }}</span>
      </SvgButton>
      <SvgButton>
        <IconSprite name="icon-settings" />
        <span class="text-[14px] cursor-pointer" @click="router.push('/profile')">Мой Профиль</span>
      </SvgButton>
      <SvgButton>
        <IconSprite name="exit" />
        <span class="text-[14px] cursor-pointer" @click="animeStore.logout">Выйти</span>
      </SvgButton>
    </ModalMenu>
    <!-- <ModalMenu v-if="buttonAvatarModal" @click="buttonAvatarModal = false">
      <SvgButton @click="animeStore.modal = true">
        <IconSprite name="icon-load" />
        <Button :text="'Загрузить Фотографию'" :style="'font-normal'" />
      </SvgButton>
      <SvgButton @click="deleteAvatar">
        <IconSprite name="icon-delete" />
        <Button :text="'Удалить фотографию'" :style="'font-normal'" />
      </SvgButton>
    </ModalMenu> -->
  </header>
</template>

<style scoped>
.active {
  color: red;
}
</style>
