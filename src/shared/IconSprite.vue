<script setup lang="ts">
import SvgSprite from './SvgSprite.vue'

const getFilePath = (filePath: string, base?: string) =>
  new URL(filePath, base ?? import.meta.url).href

const getHUDAsset = (assetName: string): string =>
  getFilePath(`../../src/assets/img/${assetName}`, import.meta.url)

const sprite = getHUDAsset('sprite.svg')

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
