<script setup lang="ts">
import { ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import Button from '@/shared/ui/Button.vue'

const cropperRef = ref(null)

const change = async () => {
  const { canvas } = cropperRef.value.getResult()
  if (!canvas) {
    emit('croppedImageBlob', null)
    return
  }
  const croppedImageBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'))
  emit('croppedImageBlob', croppedImageBlob)
}

const props = defineProps<{
  src: string | ArrayBuffer | null
}>()

const emit = defineEmits(['croppedImageBlob'])
</script>

<template>
  <div class="flex items-center flex-col">
    <cropper
      ref="cropperRef"
      class="flex w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]"
      :src="props.src"
      :auto-zoom="true"
      :stencil-size="{
        width: 250,
        height: 250
      }"
      image-restriction="stencil"
    />
    <Button @click="change" :text="'Загрузить аватар'" :style="'m-1 p-2 font-medium text-gray-500 rounded-[10px] hover:shadow-shadowDrop hover:ring-[1px] hover:ring-cyan-300'"/>
  </div>
</template>
