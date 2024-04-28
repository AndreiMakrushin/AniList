<script setup lang="ts">
import { useAnimeStore } from '@/stores/animeStore'
import Profile from '@/widgets/profile/Profile.vue'
import { supabase } from '@/supabase'
import { computed, onMounted, onUnmounted, onUpdated, ref, watch } from 'vue'
import type { addAnime, User } from '@/stores/types'
import { useRouter } from 'vue-router'
import noimg from '@/assets/img/noimg.jpeg'

const router = useRouter()
const animeStore = useAnimeStore()

const aniHistory = ref<addAnime>(null)
const deleteAvatar = async () => {
  await supabase.from('users').update({ avatar_url: null }).match({ id: animeStore.user.id })
}
const getAnime = async () => {
  const { data } = await supabase.from('animeUserList').select().eq('userId', animeStore.user.id)
  aniHistory.value = data
  console.log(data);
}
onMounted(() => {
  if (!animeStore.user) return
  getAnime()
})

watch(() => animeStore.user, () => {
  if (!animeStore.user) return
  getAnime()
})

const reverceAnime = computed(() => {
  return aniHistory.value?.reverse()
})
onUnmounted(() => {
  animeStore.animeEpisode = 1
})


</script>

<template>
  <div class="flex flex-col w-[100%] justify-center items-center mt-3">
    <Profile
      :user="animeStore.user"
      @loadAvatar="animeStore.modal = $event"
      @deleteAvatar="deleteAvatar()"
      :statusAnime="null"
    />
    <div class="flex flex-col gap-5 mt-10">
      <div
        v-for="i in reverceAnime"
        :key="i"
        class="relative cursor-pointer flex gap-5 rounded-[10px] overflow-hidden"
        @click="router.push(`/anime/${i.animeId}`), (animeStore.animeEpisode = i.episode)"
      >
        <img :src="i.img === null ? noimg : i.img" alt="" class="w-[100%]" />
        <div class="absolute bottom-0 left-0 flex flex-col bg-white w-[100%] px-2">
          <h1 class="text-[30px]">{{ i.nameAnime }}</h1>
          <h3>Серия: {{ i.episode }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
