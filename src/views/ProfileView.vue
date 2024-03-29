<script setup lang="ts">
import { useAnimeStore } from '@/stores/animeStore'
import Avatar from '../shared/ui/Avatar.vue'
import Button from '@/shared/ui/Button.vue'
const animeStore = useAnimeStore()
</script>

<template>
  <div class="flex w-[100%] justify-center mt-3">
    <div class="flex flex-row w-[911px] h-[190px] p-[20px] shadow-shadowDrop rounded-[10px] justify-between">
      <Avatar :style="'w-[150px] h-[150px]'" :img="animeStore.user?.avatar_url" />
      <div class="flex flex-col font-normal text-[20px]">
        <span class="text-gray-500">{{ animeStore.user?.name }}</span>
        <div class="flex flex-row gap-6 h-[100%] items-end">
          <span class="text-gray-500">Смотрю: 0</span>
          <span class="text-gray-500">Просмотрено: 0</span>
          <span class="text-gray-500">Запланировано: 0</span>
        </div>
      </div>
      <div>
        <Button :text="'Обновить пароль'" :style="' rounded-[10px] font-medium hover:shadow-shadowDrop'" @click="animeStore.recoverPassword(animeStore.user?.email)"/>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
