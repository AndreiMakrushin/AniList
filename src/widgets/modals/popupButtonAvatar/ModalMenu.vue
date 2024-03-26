<script setup lang="ts">
import SvgButton from './SvgButton.vue';
import IconSprite from '@/shared/IconSprite.vue'
import Button from '@/shared/ui/Button.vue'

defineProps<{
  userName: string | undefined
}>()
</script>

<template>
    <div class="absolute right-2 w-[302px] h-[375px] shadow-shadowDrop rounded-b-[10px]">
      <SvgButton>
        <IconSprite name="icon-user" />
        <span class="text-[14px] cursor-pointer">{{ userName }}</span>
      </SvgButton>
      <SvgButton>
        <IconSprite name="exit" />
        <Button :text="'выйти'" :style="'font-medium'"/>
      </SvgButton>
    </div>
</template>

<style scoped>

</style>