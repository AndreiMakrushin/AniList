<script setup lang="ts">
import Span from '@/shared/ui/Span.vue'
import { useAnimeStore } from '@/stores/animeStore'
import { supabase } from '@/supabase'
import SvgButton from '@/widgets/modals/popupButtonAvatar/SvgButton.vue'
import IconSprite from '@/shared/IconSprite.vue'
import Button from '@/shared/ui/Button.vue'

const animeStore = useAnimeStore()

const deleteAvatar = async () => {
  await supabase.from('users').update({ avatar_url: null }).match({ id: animeStore.user.id })
}
</script>

<template>
  <div class="absolute right-2 shadow-shadowDrop rounded-b-[10px] text-[14px] p-3">
    <div class="flex flex-col justify-center items-center gap-3">
      <SvgButton @click="animeStore.modal = true">
        <IconSprite name="icon-load" />
        <Button :text="'Загрузить Фотографию'" :style="'font-normal'" />
      </SvgButton>
      <SvgButton @click="deleteAvatar">
        <IconSprite name="icon-delete" />
        <Button :text="'Удалить фотографию'" :style="'font-normal'" />
      </SvgButton>
    </div>
  </div>
</template>
