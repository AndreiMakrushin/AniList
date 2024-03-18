<script setup lang="ts">
import { useAnimeStore } from '../stores/animeStore'
import { supabase } from '../supabase'
import { ref, watch } from 'vue'
import Cropp from './Cropp.vue'
import DangerText from '../shared/ui/DangerText.vue'
import UploadInput from '../shared/ui/UploadInput.vue'

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
  } else {
    noAvatar.value = 'Загрузите изображение'
  }
}
watch(avatar, () => {
  noAvatar.value = ''
})
</script>

<template>
  <Teleport to="body">
    <div class="absolute top-0 w-[100%] h-[100%]" v-if="animeStore.modal">
      <div class="w-[100%] h-[100%] bg-black opacity-[0.5]" @click="animeStore.modal = false"></div>
      <div class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div class="add-avatar">
          <UploadInput @preloadFile="preloadFile = $event" @avatar="avatar = $event" />
          <DangerText :dangerText="noAvatar" />
          <Cropp :src="preloadFile" @croppedImageBlob="addAvatar($event)" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
