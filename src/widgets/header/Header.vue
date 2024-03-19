<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAnimeStore } from '../../stores/animeStore'
import userImage from '@/assets/img/user.png'

const animeStore = useAnimeStore()
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
        <span class="text-[14px] cursor-pointer">{{ animeStore.user?.name }}</span>
        <img
          class="rounded-[50%] object-cover overflow-hidden w-[32px] h-[32px]"
          :src="
            animeStore.user?.avatar_url
              ? `https://ivpfaitqeojbyulslqde.supabase.co/storage/v1/object/public/images/${animeStore.user.avatar_url}`
              : userImage
          "
          alt=""
        />
      </main>
    </div>
    <div class="absolute right-2 w-[302px] h-[375px] shadow-shadowDrop rounded-b-[10px]">
      <div class="text-green-500 flex flex-row items-center gap-2 text-center cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M8.32 2h.93a.75.75 0 1 1 0 1.5h-.9c-1 0-1.7 0-2.24.04a2.9 2.9 0 0 0-1.1.26A2.75 2.75 0 0 0 3.8 5c-.13.25-.21.57-.26 1.11-.04.55-.04 1.25-.04 2.24v3.3c0 1 0 1.7.04 2.24.05.53.13.86.26 1.1A2.75 2.75 0 0 0 5 16.2c.25.13.57.21 1.11.26.55.04 1.25.04 2.24.04h.9a.75.75 0 0 1 0 1.5h-.93c-.96 0-1.72 0-2.33-.05a4.39 4.39 0 0 1-1.67-.41 4.25 4.25 0 0 1-1.86-1.86A4.38 4.38 0 0 1 2.05 14C2 13.4 2 12.64 2 11.68V8.32c0-.96 0-1.72.05-2.33.05-.63.16-1.17.41-1.67a4.25 4.25 0 0 1 1.86-1.86c.5-.25 1.04-.36 1.67-.41C6.6 2 7.36 2 8.32 2Zm5.9 4.97a.75.75 0 0 1 1.06 0l2.5 2.5a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 1 1-1.06-1.06l1.22-1.22H8.75a.75.75 0 0 1 0-1.5h6.69l-1.22-1.22a.75.75 0 0 1 0-1.06Z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <span>text</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.active {
  color: red;
}
</style>
