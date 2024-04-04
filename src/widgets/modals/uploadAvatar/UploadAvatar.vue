<script setup lang="ts">
import { useAnimeStore } from '@/stores/animeStore'
import { supabase } from '@/supabas'
import { computed, ref, watch } from 'vue'
import Cropp from './Cropp.vue'
import DangerText from '@/shared/ui/DangerText.vue'
import UploadInput from '@/shared/ui/UploadInput.vue'
import Button from '@/shared/ui/Button.vue'

const animeStore = useAnimeStore()

const avatar = ref<File | null>(null)
const noAvatar = ref<string>('')
const preloadFile = ref<string | ArrayBuffer | null>(null)

const addAvatar = async (e: Event) => {
  const fileName = Math.floor(Math.random() * 9000000000 + 1000000000)

  let filePath
  if (avatar.value) {
    const { data, error } = await supabase.storage.from('images').upload('public/' + fileName, e)
    if (error) {
      console.error(error)
    }
    if (data) {
      filePath = data.path

      await supabase
        .from('users')
        .update({
          avatar_url: filePath
        })
        .match({ id: animeStore.user.id })
    }
    noAvatar.value = ''
    animeStore.modal = false
    avatar.value = null
    preloadFile.value = null
  } else {
    noAvatar.value = 'Загрузите изображение'
  }
}
watch(avatar, () => {
  noAvatar.value = ''
})

const loadingAvatar = (e: Event) => {
  preloadFile.value = e.preloadFile
  avatar.value = e.avatar
}
const openFileInput = () => {
  const fileInput = document.getElementById('file-input')
  if (fileInput) {
    fileInput.click()
  }
}
const avatarButtonStatus = computed(() => {
  return avatar.value?.name !== undefined ? avatar.value?.name : 'Выберите аватар'
})
</script>

<template>
  <Teleport to="body">
    <div class="absolute z-50 top-0 w-[100%] h-[100%]" v-if="animeStore.modal">
      <div class="w-[100%] h-[100%] bg-black opacity-[0.5]" @click="animeStore.modal = false"></div>
      <div class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div class="flex flex-col items-center bg-white rounded-[10px]">
          <div>
            <UploadInput id="file-input" @loadingAvatar="loadingAvatar($event)" :type="'file'" />
            <Button
              @click="openFileInput()"
              :text="avatarButtonStatus"
              :style="'m-1 p-2 font-medium text-gray-500 rounded-[10px] hover:shadow-shadowDrop hover:ring-[1px] hover:ring-cyan-300'"
            />
          </div>
          <DangerText :dangerText="noAvatar" />
          <Cropp v-if="preloadFile" :src="preloadFile" @croppedImageBlob="addAvatar($event)" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
