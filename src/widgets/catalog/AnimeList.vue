<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAnimeStore } from '../../stores/animeStore'
import { onMounted, onBeforeUnmount, ref } from 'vue'
import type { Anime } from '@/stores/types'
import IconSprite from '@/shared/IconSprite.vue'
const router = useRouter()
const props = defineProps<{
  anime?: Anime
}>()

const animeStore = useAnimeStore()

const hovered = ref<Anime[] | null>(null)


const emit = defineEmits(['loadAnime', 'update'])
const loadAnime = async () => {
  try {
    const data = await animeStore.animeList()
    emit('loadAnime', data.list)
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error)
  }
}

const handleScroll = async () => {
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
    animeStore.animePage += 1
    await loadAnime()
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
</script>

<template>
  <div
    class="grid gap-[30px] p-[20px] 2xl:grid-cols-6 xl:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2"
  >
    <div v-for="i in props.anime" :key="i">
      <article
        @click="router.push(`/anime/${i.id}`)"
        @mouseover="hovered = i"
        @mouseleave="hovered = null"
        class="flex flex-col items-center gap-3 cursor-pointer"
      >
        <div class="relative z-0 rounded-[15px] overflow-hidden">
          <img
            :src="`https://dl-20240330-7.anilib.moe${i.posters.original.url}`"
            class="w-full h-auto"
          />
          <div
            class="flex absolute z-10 top-0 left-0 w-full h-full duration-300 items-center justify-center text-transparent"
            :class="{ 'bg-cardOpacity text-white': hovered === i }"
          >
            <IconSprite :width="50" :height="50" name="icon-play" />
          </div>
        </div>
        <div class="flex flex-col items-center w-full">
          <h2
            class="font-medium w-full duration-300 whitespace-nowrap text-ellipsis overflow-hidden"
            :class="{ 'text-red-500': hovered === i }"
          >
            {{ i.names.ru }}
          </h2>
          <p class="font-medium text-gray-500">{{ i.season.year }}</p>
        </div>
      </article>
    </div>
  </div>
</template>
