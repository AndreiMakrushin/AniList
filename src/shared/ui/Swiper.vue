<script setup lang="ts">
import { defineProps } from 'vue'
import noimg from '@/assets/img/noAnime.png'
import type { addAnime, AnimeStatus } from '@/stores/types'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

const props = defineProps<{
  history: addAnime
  labelStatus: string[]
  list: AnimeStatus
}>()

const emit = defineEmits(['pushing'])

const animePush = (id: number, episode: number) => {
  emit('pushing', { id, episode })
}
const filterList = (key: string) => {
  return props.list.filter((item: AnimeStatus) => item.status === key)
}
</script>

<template>
  <Swiper
    :slides-per-view="1"
    :spaceBetween="70"
    :pagination="{ clickable: true }"
    :grab-cursor="true"
    :autoHeight="true"
    :loop="true"
    class="w-full h-full overflow-hidden"
  >
    <SwiperSlide
      ><div class="flex flex-col gap-5">
        <span class="text-white text-[18px]">История просмотра</span>
        <div
          v-for="i in props.history"
          :key="i"
          class="relative cursor-pointer flex gap-5 rounded-[10px] overflow-hidden max-h-[422px]"
          @click="animePush(i.animeId, i.episode)"
        >
          <img :src="i.img === null ? noimg : i.img" alt="" class="w-[100%] object-contain" />
          <div class="absolute bottom-0 left-0 flex flex-col bg-white w-[100%]">
            <div class="relative flex">
              <span class="w-full flex h-[5px] bg-slate-300"></span>
              <span
                class="h-[5px] bg-red-500 absolute top-0 left-0"
                :style="`width: ${(i.current_Time / i.duration_Time) * 100}%`"
              ></span>
            </div>
            <div class="px-2">
              <h1 class="text-[18px] w-full whitespace-nowrap text-ellipsis overflow-hidden">
                {{ i.nameAnime }}
              </h1>
              <h3>Серия: {{ i.episode }}</h3>
            </div>
          </div>
        </div>
      </div></SwiperSlide
    >
    <SwiperSlide
      class="text-white min-h-[50vh] text-[18px] flex gap-5 cursor-pointer"
      v-for="status in props.labelStatus"
      :key="status"
    >
      <div class="flex flex-col gap-3">
        <span>{{ status }}</span>
        <div v-if="props.list && filterList(status).length > 0" class="gap-2 flex flex-col">
          <div v-for="i in filterList(status)" :key="i" @click="animePush(i.animeId, 1)">
            <div class="flex flex-row justify-between w-full gap-2 overflow-hidden">
              <img :src="i.img" class="max-w-[100px] rounded-[10px]" />
              <div class="flex flex-col w-full justify-between gap-5">
                <span class="max-w-[200px] whitespace-nowrap text-ellipsis overflow-hidden">{{
                  i.nameAnime
                }}</span>
                <span>{{ i.status }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="flex justify-center items-center w-full h-full">
          <img :src="noimg" alt="" class="rounded-[10px]" />
        </div>
      </div>
    </SwiperSlide>
  </Swiper>
</template>

<style scoped></style>
