<script setup lang="ts">
import IconSprite from '../../../shared/IconSprite.vue';
const emit = defineEmits(['prevEpisode', 'nextEpisode', 'playVideo', 'videoPaused', 'screenShot', 'openSelectQuality', 'fullScreen', 'normalScreen'])

defineProps<{
    playing?: boolean
    videoTime?: string
    videoDuration?: string
    fullscreen?: boolean
}>()
</script>
<template>
  <div class="flex flex-row items-center justify-between">
    <div class="flex flex-row gap-2 items-center">
      <IconSprite class="cursor-pointer" name="icon-prev" @click.stop="emit('prevEpisode')" />
      <IconSprite
        class="cursor-pointer"
        name="icon-pause"
        @click.stop="emit('videoPaused')"
        v-if="playing"
      />
      <IconSprite
        class="cursor-pointer"
        name="icon-play-small"
        @click.stop="emit('playVideo')"
        v-if="!playing"
      />
      <IconSprite class="cursor-pointer" name="icon-next" @click.stop="emit('nextEpisode')" />

      <p>
        {{ videoTime }}
        / {{ videoDuration }}
      </p>
      <IconSprite name="icon-screenShot" @click.stop="emit('screenShot')" class="cursor-pointer" />
    </div>
    <div class="flex flex-row gap-3">
      <IconSprite
        @click.stop="emit('openSelectQuality')"
        name="icon-settings"
        class="hover:rotate-[60deg] duration-short cursor-pointer"
      />
      <IconSprite
        v-if="!fullscreen"
        name="icon-fullScreen"
        class="hover:scale-110 duration-short cursor-pointer"
        @click="emit('fullScreen')"
      />
      <IconSprite
        v-else
        name="icon-smallScreen"
        class="hover:scale-20 duration-short cursor-pointer"
        @click="emit('normalScreen')"
      />
    </div>
  </div>
</template>
