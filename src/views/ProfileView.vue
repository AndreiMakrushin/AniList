<script setup lang="ts">
import { useAnimeStore } from '@/stores/animeStore'
import Profile from '@/widgets/profile/Profile.vue'
import { supabase } from '@/supabase'
const animeStore = useAnimeStore()

const deleteAvatar = async () => {
  await supabase.from('users').update({ avatar_url: null }).match({ id: animeStore.user.id })
}
</script>

<template>
  <div class="flex w-[100%] justify-center mt-3">
    <Profile
      :user="animeStore.user"
      @loadAvatar="animeStore.modal = $event"
      @deleteAvatar="deleteAvatar()"
      :statusAnime="null"
    />
  </div>
</template>

<style scoped></style>
