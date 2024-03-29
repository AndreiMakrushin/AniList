<script setup lang="ts">
import Avatar from '@/shared/ui/Avatar.vue';
import Button from '@/shared/ui/Button.vue';
defineProps<{
    user: object | null,
    statusAnime: object | null
}>()
</script>

<template>
  <div
    class="flex flex-row w-[911px] h-[190px] p-[20px] shadow-shadowDrop rounded-[10px] justify-between"
  >
    <Avatar :style="'w-[150px] h-[150px]'" :img="user?.avatar_url" />
    <div class="flex flex-col font-normal text-[20px]">
      <span class="text-gray-500">{{ user?.name }}</span>
      <div class="flex flex-row gap-6 h-[100%] items-end">
        <span class="text-gray-500">Смотрю: 0</span>
        <span class="text-gray-500">Просмотрено: 0</span>
        <span class="text-gray-500">Запланировано: 0</span>
      </div>
    </div>
    <div>
      <Button
        :text="'Обновить пароль'"
        :style="' rounded-[10px] font-medium hover:shadow-shadowDrop'"
        @click="$emit('recoverPassword', user?.email)"
      />
    </div>
  </div>
</template>
