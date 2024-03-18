<script setup lang="ts">
const uploadAvatar = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    emit('avatar', file)
    const reader = new FileReader()
    reader.onload = function (e) {
      emit('preloadFile', e.target?.result as string | ArrayBuffer | null)
    }
    reader.readAsDataURL(file)
  }
}
const emit = defineEmits(['avatar', 'preloadFile'])
</script>

<template>
  <input
    type="file"
    accept=".jpeg, .png, .jpg"
    @change="uploadAvatar"
    class="appearance-none bg-transparent border-none w-full text-transparent mr-3 py-1 px-2 leading-tight focus:outline-none"
  />
</template>

<style scoped></style>
