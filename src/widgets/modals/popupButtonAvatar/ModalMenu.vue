<script setup lang="ts">
import SvgButton from './SvgButton.vue';
import IconSprite from '@/shared/IconSprite.vue'
import Button from '@/shared/ui/Button.vue'

</script>

<template>
    <div class="absolute right-2 w-[302px] h-[375px] shadow-shadowDrop rounded-b-[10px]">
      <SvgButton>
        <IconSprite name="exit" />
        <Button :text="'выйти'" :style="'font-medium'"/>
      </SvgButton>
    </div>
</template>

<style scoped>

</style>