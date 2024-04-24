<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAnimeStore } from '@/stores/animeStore'
import Header from './widgets/header/Header.vue'
import RegistrationAndAutorisationModal from './widgets/modals/regAuth/RegistrationAndAutorisationModal.vue'
import UploadAvatar from './widgets/modals/uploadAvatar/UploadAvatar.vue'

const animeStore = useAnimeStore()

onMounted(() => {
  animeStore.getUser()
})
</script>

<template>
    <div class="flex flex-col justify-center max-w-[1340px] mx-auto">
      <Header />
      <RegistrationAndAutorisationModal />
      <UploadAvatar />
      <RouterView />
    </div>
</template>

