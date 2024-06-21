<script setup lang="ts">
import type { Item } from '@/stores/types'
import { defineProps } from 'vue'
import Avatar from '@/shared/ui/Avatar.vue'
import Childrens from './Childrens.vue'

const props = defineProps<{
  commentaryArray: Item
}>()
</script>

<template>
  <div>
    <div class="pl-[10%]  flex flex-row gap-3 justify-center items-center">
      <div class="flex flex-col justify-center items-center">
        <Avatar :img="props.commentaryArray.img" :style="'w-[30px] h-[30px]'" />
        <span>{{ props.commentaryArray.userName }}</span>
      </div>
      <div class="flex flex-col grow justify-between">
        <span>{{ props.commentaryArray.commentary }}</span>
        <div class="flex justify-end">
          <span
            class="text-[15px] self-end cursor-pointer"
            @click="replyToMessage(j.userId, j.userName, j.randomId)"
            >Ответить</span
          >
        </div>
      </div>
    </div>
    <div v-if="props.commentaryArray.children && props.commentaryArray.children.length > 0"></div>
    <Childrens
      v-for="children in props.commentaryArray.children"
      :key="children"
      :commentaryArray="children"
    />
  </div>
</template>
