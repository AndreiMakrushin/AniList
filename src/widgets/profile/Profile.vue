<script setup lang="ts">
import { ref } from 'vue'
import Avatar from '@/shared/ui/Avatar.vue'
import Button from '@/shared/ui/Button.vue'
import ModalMenu from '@/widgets/modals/popupButtonAvatar/ModalMenu.vue'
import SvgButton from '@/widgets/modals/popupButtonAvatar/SvgButton.vue'
import IconSprite from '@/shared/IconSprite.vue'

defineEmits(['loadAvatar', 'deleteAvatar'])

defineProps<{
  user?: object | null
  statusAnime?: object | null
}>()

const buttonAvatarModal = ref<boolean>(false)
</script>

<template>
  <div
    class="flex flex-row w-[60%] h-[190px] p-[20px] shadow-shadowDrop rounded-[10px] justify-between"
  >
    <Avatar :style="'max-w-[150px]'" :img="user?.avatar_url" @click="buttonAvatarModal = true" />
    <div class="font-normal text-[20px]">
      <span class="text-gray-500">{{ user?.name }}</span>
    </div>
  </div>
  <ModalMenu v-if="buttonAvatarModal" @click="buttonAvatarModal = false">
    <SvgButton @click="$emit('loadAvatar', true)">
      <IconSprite name="icon-load" />
      <Button :text="'Загрузить Фотографию'" :style="'font-normal'" />
    </SvgButton>
    <SvgButton @click="$emit('deleteAvatar')">
      <IconSprite name="icon-delete" />
      <Button :text="'Удалить фотографию'" :style="'font-normal'" />
    </SvgButton>
  </ModalMenu>
</template>
