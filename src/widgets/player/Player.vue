<script setup lang="ts">
import { onMounted, defineProps, ref, watch, computed, watchEffect } from 'vue'
import Hls from 'hls.js'
import SelectEpisode from './widgetsPlayer/SelectEpisode.vue'
import IconSprite from '@/shared/IconSprite.vue'
import Preview from './widgetsPlayer/Preview.vue'
import ProgressBar from './widgetsPlayer/ProgressBar.vue'

const props = defineProps<{
  AnimePlay?: Object
}>()

const episodeAnime = ref<number>(1)
const quality = ref<string>('fhd')
const timer = ref<number>(0)

const seria = computed(() => {
  return 'https://cache.libria.fun' + props.AnimePlay?.list[episodeAnime.value]?.hls[quality.value]
})

const previewAnime = computed(() => {
  return 'https://dl-20211030-963.anilib.top' + props.AnimePlay?.list[episodeAnime.value]?.preview
})

const videoElement = ref<HTMLVideoElement | null>(null)
const isPreview = ref<boolean>(false)
const playing = ref<boolean>(false)

onMounted(() => {
  watch([props, episodeAnime, quality], () => {
    if (!seria.value || !videoElement.value) {
      return
    }
    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(seria.value)
      hls.attachMedia(videoElement.value)
    } else if (videoElement.value?.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.value.src = seria.value
    }
  })
})

watch(episodeAnime, () => {
  isPreview.value = false
})

const updateEpisode = (event: string) => {
  episodeAnime.value = parseInt(event)
}
const playVideo = () => {
  isPreview.value = true
  playing.value = true
  videoElement.value.play()
}

const videoPaused = () => {
  playing.value = false
  videoElement.value.pause()
}

const videoTime = computed(() => {
  const time = Math.floor(timer.value)
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const videoDuration = computed(() => {
  const time = Math.floor(videoElement.value?.duration)
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const progress = computed(() => {
  return {
    width: `${(timer.value / videoElement.value?.duration) * 100}%`
  }
})

const timeUpdate = () => {
  timer.value = videoElement.value?.currentTime
}
const nextEpisode = () => {
  if (episodeAnime.value === props.AnimePlay?.list.length - 1) return
  episodeAnime.value++
}
const prevEpisode = () => {
  if (episodeAnime.value === 0) return
  episodeAnime.value--
}
const seekVideo = (e: MouseEvent) => {
  const target = e.target as HTMLElement

  if (!videoElement.value || !target) return

  const progressWidth = target.offsetWidth
  const clickX = e.offsetX
  const newTime = (clickX / progressWidth) * (videoElement.value?.duration || 0)

  if (videoElement.value) {
    videoElement.value.currentTime = newTime
  }
}
const fullScreen = () => {
  if (!videoElement.value) return
  const player = document.getElementById('player')
  if (!player) return
  player.requestFullscreen()
}
</script>

<template>
  <div class="max-w-[700px] relative flex flex-col" id="player">
    <Preview :previewAnime="previewAnime" v-if="!isPreview" @click="playVideo" />

    <video
      v-show="isPreview"
      class="w-full h-full rounded-[10px]"
      ref="videoElement"
      @timeupdate="timeUpdate"
      @click="playing ? videoPaused() : playVideo()"
      :controls="false"
    ></video>
    <SelectEpisode
      class="absolute top-2 right-2"
      :episodes="props.AnimePlay?.list"
      :selected="episodeAnime"
      @update="updateEpisode($event)"
    />
    <div class="absolute bottom-0 w-full flex flex-col text-white px-2 py-1 gap-1" v-if="isPreview">
      <ProgressBar
        :style="progress"
        :value="(timer / videoElement?.duration) * 100"
        @update="seekVideo($event)"
      />

      <div class="flex flex-row items-center justify-between">
        <div class="flex flex-row gap-2 items-center">
          <IconSprite class="cursor-pointer" name="icon-prev" @click.stop="prevEpisode" />
          <IconSprite
            class="cursor-pointer"
            name="icon-pause"
            @click.stop="videoPaused"
            v-if="playing"
          />
          <IconSprite
            class="cursor-pointer"
            name="icon-play-small"
            @click.stop="playVideo"
            v-if="!playing"
          />
          <IconSprite class="cursor-pointer" name="icon-next" @click.stop="nextEpisode" />

          <p>
            {{ videoTime }}
            / {{ videoDuration }}
          </p>
        </div>
        <div class="flex flex-row gap-3">
          <IconSprite
            name="icon-settings"
            class="hover:rotate-[60deg] duration-short cursor-pointer"
          />
          <IconSprite
            name="icon-fullScreen"
            class="hover:scale-110 duration-short cursor-pointer"
            @click="fullScreen()"
          />
        </div>
      </div>
    </div>
  </div>
</template>
