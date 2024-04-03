<script setup lang="ts">
import SvgSprite from './SvgSprite.vue'

const sprite = '/src/assets/img/sprite.svg'

defineProps<{
  name: string
  width?: number
  height?: number
}>()
</script>

<template>
  <SvgSprite :icon="name" :width="width? width : 20" :height="height? height : 20" :sprite="sprite" />
</template>

<style scoped lang="sass"></style>
