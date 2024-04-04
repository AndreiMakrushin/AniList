<script setup lang="ts">
defineProps<{
  type?: string
}>()
const uploadAvatar = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = function (e) {
      emit('loadingAvatar', { preloadFile: e.target?.result as string | ArrayBuffer | null, avatar: file })
    }
    reader.readAsDataURL(file)
  }
}
const emit = defineEmits(['loadingAvatar'])
</script>

<template>
  <input :type="type" accept=".jpeg, .png, .jpg" @change="uploadAvatar" class="hidden" />
</template>

<style scoped></style>
