<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAnimeStore } from '@/stores/animeStore'
import Header from './widgets/header/Header.vue'

const animeStore = useAnimeStore()

onMounted(() => {
  animeStore.getUser()
})
</script>

<template>
  <Header />
  <div class="mt-[75px]"></div>

  <RouterView />
</template>
