<script setup lang="ts">
import type { AnimeStatus } from '@/stores/types'
import { defineProps, defineEmits } from 'vue'

defineProps<{
  labelStatus: string[]
  filterList: AnimeStatus
  noimg: string
  status: string
}>()

const emit = defineEmits(['pushing'])
const pushing = (id: number, episode: number) => {
  emit('pushing', { id: id, episode: episode })
}
</script>

<template>
  <div
    class="text-white min-h-[50vh] text-[18px] flex gap-5 mb-[30px]"
    v-for="status in labelStatus.filter((i) => i !== 'История просмотра' && i === status)"
    :key="status"
  >
    <div class="flex flex-col gap-3 w-full">
      <span>{{ status }}</span>
      <div v-if="filterList(status).length > 0" class="gap-2 flex flex-col cursor-pointer">
        <div v-for="i in filterList(status)" :key="i" @click="pushing(i.animeId, 1)">
          <div class="flex flex-row w-full justify-between gap-2">
            <img :src="i.img" class="max-w-[100px] rounded-[10px]" />
            <div class="flex flex-col w-full justify-between gap-5">
              <span class="max-h-[100px] whitespace-wrap overflow-hidden">{{ i.nameAnime }}</span>
              <span>{{ i.status }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="flex justify-center items-center w-full">
        <img :src="noimg" alt="" class="rounded-[10px]" />
      </div>
    </div>
  </div>
</template>
