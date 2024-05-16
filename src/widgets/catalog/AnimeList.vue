<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, onBeforeUnmount, ref, defineProps } from 'vue'
import type { Anime } from '@/stores/types'
import CardsCatalog from './widgetsCatalog/CardsCatalog.vue'
import Card from './widgetsCatalog/Card.vue'

const router = useRouter()
const props = defineProps<{
  anime?: Anime[]
}>()

const hovered = ref<Anime[] | null>(null)

const emit = defineEmits(['getAnimeFromApi', 'page'])
const loadAnime = () => {
  try {
    emit('getAnimeFromApi')
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error)
  }
}

const handleScroll = () => {
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 170) {
    emit('page')
    loadAnime()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  if (props.anime.length !== 0) return
  loadAnime()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

const pushingAnime = (id: number) => {
  router.push({ name: 'anime', params: { id: id, episode: '1' } })
}
</script>

<template>
  <CardsCatalog>
    <Card
      :anime="props?.anime"
      :hovered="hovered"
      @over="hovered = $event"
      @leave="hovered = null"
      @push="pushingAnime($event.id)"
    />
  </CardsCatalog>
</template>
