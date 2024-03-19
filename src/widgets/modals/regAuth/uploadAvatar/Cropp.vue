<script setup lang="ts">
import { ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import Button from '../../../../shared/ui/Button.vue'

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
  <div>
    <cropper
      ref="cropperRef"
      class="flex w-[400px] h-[400px]"
      :src="props.src"
      :auto-zoom="true"
      :stencil-size="{
        width: 280,
        height: 280
      }"
      image-restriction="stencil"
    />
    <Button @click="change" :text="'Загрузить аватар'" />
  </div>
</template>
