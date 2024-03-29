<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAnimeStore } from '@/stores/animeStore'
import Header from './widgets/header/Header.vue'
import RegistrationAndAutorisationModal from './widgets/modals/regAuth/RegistrationAndAutorisationModal.vue'

const animeStore = useAnimeStore()

onMounted(() => {
  animeStore.getUser()
})
</script>

<template>
  <div class="flex flex-col justify-center">
    <Header />
    <div class="mt-[50px]"></div>
    <RegistrationAndAutorisationModal />
    <RouterView />
  </div>
</template>
