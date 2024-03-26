<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAnimeStore } from '@/stores/animeStore'
import userImage from '@/assets/img/user.png'
import PopupButtonAvatar from '@/widgets/modals/popupButtonAvatar/PopupButtonAvatar.vue';
import ModalMenu from '@/widgets/modals/popupButtonAvatar/ModalMenu.vue';

const animeStore = useAnimeStore()

const buttonAvatarModal = ref<boolean>(false)
</script>

<template>
  <header class="fixed top-0 w-[100%] bg-slate-400">
    <div class="justify-between items-center px-4 py-2 flex">
      <div class="flex flex-row gap-5 w-[50%]">
        <span class="text-[20px] font-medium">AniList</span>
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
        <img
          @click="buttonAvatarModal = !buttonAvatarModal"
          class="rounded-[50%] cursor-pointer object-cover overflow-hidden w-[32px] h-[32px]"
          :src="
            animeStore.user?.avatar_url
              ? `https://ivpfaitqeojbyulslqde.supabase.co/storage/v1/object/public/images/${animeStore.user.avatar_url}`
              : userImage
          "
          alt=""
        />
      </main>
    </div>
    <ModalMenu :userName="animeStore.user?.name"/>
    <PopupButtonAvatar v-if="buttonAvatarModal" @click="buttonAvatarModal = false"/>
  </header>
</template>

<style scoped>
.active {
  color: red;
}
</style>
