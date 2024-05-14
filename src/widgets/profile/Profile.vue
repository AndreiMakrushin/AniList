<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
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

let timeoutId: number | null = null

const handleAvatarMouseEnter = () => {
  buttonAvatarModal.value = true
  clearTimeout(timeoutId)
}

const handleAvatarMouseLeave = () => {
  timeoutId = setTimeout(() => {
    buttonAvatarModal.value = false
  }, 500)
}

const handleModalMenuClick = () => {
  buttonAvatarModal.value = false
}

const handleModalMenuMouseEnter = () => {
  clearTimeout(timeoutId)
}

const handleModalMenuMouseLeave = () => {
  timeoutId = setTimeout(() => {
    buttonAvatarModal.value = false
  }, 500)
}

onBeforeUnmount(() => {
  clearTimeout(timeoutId)
})
</script>

<template>
  <div class="relative flex flex-row w-[80%] sm:w-[60%] h-[190px] p-[20px] shadow-shadowDrop rounded-[10px]">
    <div class="justify-between flex w-full">
      <div class="flex items-center">
        <Avatar
        :style="'max-w-[100px] max-h-[100px] sm:max-w-[150px] sm:max-h-[150px]'"
        :img="user?.avatar_url"
        @mouseenter="handleAvatarMouseEnter"
        @mouseleave="handleAvatarMouseLeave"
      />
      </div>
      <span class="text-[#e4e4e4] font-normal text-[20px]">{{ user?.name }}</span>
    </div>
      <ModalMenu
        v-if="buttonAvatarModal"
        @mouseleave="handleModalMenuMouseLeave"
        @mouseenter="handleModalMenuMouseEnter"
        @click="handleModalMenuClick"
        :style="'left-0 top-[90%]'"
      >
        <SvgButton @click="$emit('loadAvatar', true)">
          <IconSprite name="icon-load" />
          <Button :text="'Загрузить Фотографию'" :style="'font-normal p-0'" />
        </SvgButton>
        <SvgButton @click="$emit('deleteAvatar')">
          <IconSprite name="icon-delete" />
          <Button :text="'Удалить фотографию'" :style="'font-normal p-0'" />
        </SvgButton>
      </ModalMenu>
  </div>
</template>
