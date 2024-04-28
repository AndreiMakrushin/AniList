<script setup lang="ts">
import { defineProps } from 'vue'
import SvgSprite from './SvgSprite.vue'

const sprite = '/src/assets/img/sprite.svg'


withDefaults(defineProps<{
  name?: string
  width?: number
  height?: number
}>(),{
  width: 20,
  height: 20
})
</script>

<template>
  <!-- <SvgSprite :icon="name" :width="width? width : 20" :height="height? height : 20" :sprite="sprite" /> -->
  <span>
    <svg
			class="icon"
			v-bind="$attrs"
			:width="width"
			:height="height"
		>
			<use :xlink:href="`${sprite}#${name}`" />
		</svg>
  </span>
</template>

