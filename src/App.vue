<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAnimeStore } from '@/stores/animeStore'
import Header from './widgets/header/Header.vue'
import RegistrationAndAutorisationModal from './widgets/modals/regAuth/RegistrationAndAutorisationModal.vue'
import UploadAvatar from './widgets/modals/uploadAvatar/UploadAvatar.vue'
import IconSprite from './shared/IconSprite.vue'
import { upScroll } from '@/features/upScroll/upScroll'

const animeStore = useAnimeStore()

const handleKeyDown = (event) => {
  if (event.key === ' ' && event.target === document.body) {
    event.preventDefault()
  }
}

onMounted(() => {
  animeStore.getUser()
  document.addEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="flex flex-col justify-center max-w-[1340px] mx-auto">
    <Header />
    <RegistrationAndAutorisationModal />
    <UploadAvatar />
    <RouterView />
  </div>
  <div class="fixed z-50 bottom-1 right-1 text-white cursor-pointer" @click="upScroll()">
    <IconSprite :width="70" :height="70" name="icon-arrow-up" />
  </div>
  <!-- <Footer /> -->
</template>
