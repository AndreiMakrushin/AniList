<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAnimeStore } from '../../stores/animeStore'
import userImage from '@/assets/img/user.png'

const animeStore = useAnimeStore()
</script>

<template>
  <header class="flex  bg-slate-400 justify-between items-center p-4">
    <div class="flex flex-row gap-5 w-[50%]">
      <img
        class="flex w-[40px] h-[40px] rounded-full"
        src="https://webitnow.co.il/wp-content/uploads/עמודי-404-מה-עושים-1170x640.jpg"
        alt=""
      />
      <input type="text" class="flex grow font-normal text-[22px] pl-[10px] rounded-[5px] outline-none focus:ring-[1px] focus:ring-red-500"/>
    </div>
    <nav class="flex flex-row gap-3 text-[20px]">
      <RouterLink to="/" active-class="active">Home</RouterLink>
      <RouterLink to="/about" active-class="active">About</RouterLink>
    </nav>
    <main class="flex flex-row items-center gap-5" v-if="animeStore.user">
      <span class="text-[20px] cursor-pointer">{{ animeStore.user?.name }}</span>
      <img
        class="rounded-[50%] object-cover overflow-hidden w-[40px] h-[40px]"
        :src="
          animeStore.user?.avatar_url
            ? `https://ivpfaitqeojbyulslqde.supabase.co/storage/v1/object/public/images/${animeStore.user.avatar_url}`
            : userImage
        "
        alt=""
      />
    </main>
  </header>
</template>

<style scoped>
.active {
  color: red;
}
</style>
