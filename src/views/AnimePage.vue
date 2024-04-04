<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { API_anime } from '@/composables'
import { useRoute } from 'vue-router'
import axios from 'axios'
import type { Anime } from '@/stores/types'

const route = useRoute()
const anime = ref<Anime | null>(null)
onMounted(async () => {
  const res = await axios.get(`${API_anime}${route.params.id}`)
  return (anime.value = res.data)
})
</script>

<template>
  <div>{{ anime }}</div>
</template>

<style scoped></style>
/* animeStore.aniList.find((el) => el.id === Number(route.params.id)) */
