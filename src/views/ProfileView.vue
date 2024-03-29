<script setup lang="ts">
import { useAnimeStore } from '@/stores/animeStore'
import Profile from '@/widgets/profile/Profile.vue'
const animeStore = useAnimeStore()
</script>

<template>
  <div class="flex w-[100%] justify-center mt-3">
    <Profile :user="animeStore.user" :statusAnime="null" @recoverPassword="animeStore.recoverPassword($event)"/>
  </div>
</template>

<style scoped></style>
