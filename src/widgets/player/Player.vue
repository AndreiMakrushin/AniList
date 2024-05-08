<script setup lang="ts">
import { onMounted, defineProps, ref, watch, computed, reactive } from 'vue'
import Hls from 'hls.js'
import SelectEpisode from './widgetsPlayer/SelectEpisode.vue'
import IconSprite from '@/shared/IconSprite.vue'
import Preview from './widgetsPlayer/Preview.vue'
import ProgressBar from './widgetsPlayer/ProgressBar.vue'
import type { Anime, User } from '@/stores/types'
import noImg from '@/assets/img/noimg.jpeg'
import { supabase } from '@/supabase'
import { useAnimeStore } from '@/stores/animeStore'
import { updateAnimeHistory } from '../../features/updateAnime/updateAnime'
import { addNewAnimeHistory } from '../../features/addAnime/addAnime'
const animeStore = useAnimeStore()

const props = defineProps<{
  user?: User
  episode?: number | undefined
  AnimePlay?: Anime
  animeName?: string
  animeId?: number
}>()

const episodeAnime = ref<number>(1)
const quality = ref<string>('hd')
const timer = ref<number>(0)
const fullscreen = ref<boolean>(false)
const videoElement = ref<HTMLVideoElement | null>(null)
const isPreview = ref<boolean>(false)
const playing = ref<boolean>(false)
const isQualityVideo = ref<boolean>(false)
const bufferedVideo = ref<number | null | undefined>(0)
const showInterface = ref<boolean>(false)

watch(props, () => {
  episodeAnime.value = props.episode
})

const seria = computed(() => {
  return 'https://cache.libria.fun' + props.AnimePlay?.list[episodeAnime.value]?.hls[quality.value]
})
const previewAnime = computed(() => {
  return props.AnimePlay?.list[episodeAnime.value]?.preview
    ? 'https://dl-20211030-963.anilib.top' + props.AnimePlay?.list[episodeAnime.value]?.preview
    : noImg
})

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
const emit = defineEmits(['updateEpisode'])

const updateEpisode = (event: string) => {
  emit('updateEpisode', Number(event))
}
/* ------------------------------------------------------------------------------------ */
const playVideo = () => {
  if (isQualityVideo.value) {
    isQualityVideo.value = false
    return
  }
  if (!videoElement.value) return
  isPreview.value = true
  playing.value = true
  videoElement.value.play()
  /* addAnimeToHistory() */
}

const videoPaused = () => {
  if (isQualityVideo.value) {
    isQualityVideo.value = false
    return
  }
  if (!videoElement.value) return
  playing.value = false
  videoElement.value.pause()
  showInterface.value = true
}
/* ------------------------------------------------------------------------------------ */
const videoTimer = (time: number) => {
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = Math.floor((time % 3600) % 60)

  if (time >= 3600) {
    const hour = Math.floor(time / 3600)
    return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
  } else {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
}

const videoTime = computed(() => {
  const time = Math.floor(timer.value)
  return videoTimer(time)
})

const videoDuration = computed(() => {
  if (!videoElement.value) return
  const time = Math.floor(videoElement.value?.duration)

  return videoTimer(time)
})

const progress = computed(() => {
  if (!videoElement.value) return
  if (!timer.value) return
  return {
    width: `${(timer.value / videoElement.value?.duration) * 100}%`
  }
})
const buffered = computed(() => {
  if (!videoElement.value) return
  if (!bufferedVideo.value) return
  return {
    width: `${(bufferedVideo.value / videoElement.value?.duration) * 100}%`
  }
})
watch(timer, () => {
  if (timer.value === videoElement.value?.duration) {
    episodeAnime.value++
  }
})
const nextEpisode = () => {
  if (episodeAnime.value === Object.keys(props.AnimePlay?.list).length) {
    episodeAnime.value = 0
  }
  episodeAnime.value++
}
const prevEpisode = () => {
  if (episodeAnime.value === 1) return
  episodeAnime.value--
}
const seekVideo = (e: MouseEvent | TouchEvent) => {
  console.log('перемещаю видео');
  
  if (!videoElement.value) return

  const progressWidth = (e.target as HTMLElement).offsetWidth
  let clickX = 0

  if (e instanceof MouseEvent) {
    clickX = (e as MouseEvent).offsetX
  } else if (e instanceof TouchEvent) {
    clickX =
      (e as TouchEvent).changedTouches[0].clientX -
      (e.target as HTMLElement).getBoundingClientRect().left
  }

  const newTime = (clickX / progressWidth) * (videoElement.value?.duration || 0)
  videoElement.value.currentTime = newTime
  videoElement.value.buffered.end(0) >= newTime
}
const fullScreen = () => {
  if (!videoElement.value) return
  const player = document.getElementById('player') as HTMLVideoElement | null
  if (!player) return
  player
    .requestFullscreen()
    .then(() => {
      fullscreen.value = true
    })
    .catch((err) => {
      console.log(err)
    })
}
const normalScreen = () => {
  if (!videoElement.value) return
  if (!fullscreen.value) return
  document.exitFullscreen()
  fullscreen.value = false
}
const openSelectQuality = () => {
  isQualityVideo.value = !isQualityVideo.value
}
const updateQuality = (event: string) => {
  quality.value = event
  isQualityVideo.value = false
}

async function addAnimeToHistory() {
  if (props.user === null) return
  try {
    const { data: existsAnime, error: existsAnimeError } = await supabase
      .from('animeUserList')
      .select()
      .filter('animeId', 'eq', props.animeId)
      .filter('episode', 'eq', episodeAnime.value)
      .filter('userId', 'eq', props.user.id)
      .single()
    if (videoElement.value && existsAnime) {
      videoElement.value.currentTime = existsAnime.current_Time
      return
    }
  } catch (error) {
    console.log(error)
  }
  const anime = {
    animeId: props.animeId,
    userId: props.user.id,
    current_Time: timer.value,
    duration_Time: Math.floor(videoElement.value?.duration || 0),
    nameAnime: props.animeName,
    img: props.AnimePlay?.list[episodeAnime.value]?.preview,
    episode: episodeAnime.value
  }
  addNewAnimeHistory(anime)
}

const timeUpdate = () => {
  timer.value = Math.floor(videoElement.value?.currentTime)
}

watch(timer, () => {
  if (props.user === null) return
  if (timer.value >= 10) {
    updateAnimeHistory(props.user.id, props.animeId, episodeAnime.value, timer.value)
  }
})
const downloadImage = (canvas: HTMLCanvasElement) => {
  console.log(canvas)
  const image = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.href = image
  link.download = 'screenshot.png'
  link.click()
}
const screenShot = () => {
  if (!videoElement.value) return
  const canvas = document.createElement('canvas')
  canvas.width = videoElement.value.videoWidth
  canvas.height = videoElement.value.videoHeight
  canvas.getContext('2d')?.drawImage(videoElement.value, 0, 0)
  downloadImage(canvas)
}
let showindTimeout: any;

const showInterfaceMouse = () => {
  console.log('показываю интерфейс');
  
  clearTimeout(showindTimeout)
  showInterface.value = true
  showindTimeout = setTimeout(() => {
    showInterface.value = false
  }, 3000)
}
const hideInterfaceMouse = () => {
  if (!playing.value) return
  showindTimeout = setTimeout(() => {
    showInterface.value = false
  }, 3000)
}

const transitionInterfaceShow = computed(() => {
  return `${showInterface.value ? 'opacity-1 duration-short' : 'opacity-0 duration-short'}`
})
</script>

<template>
  <div
    class="max-w-[700px] h-[100%] relative flex flex-col bg-slate-800 rounded-[10px]"
    id="player"
  >
    <Preview
      :previewAnime="previewAnime ? previewAnime : noImg"
      v-if="!isPreview"
      @click="playVideo(), addAnimeToHistory()"
    />

    <video
      @mouseenter="showInterfaceMouse"
      @mouseleave="hideInterfaceMouse"
      @mousemove="showInterfaceMouse"
      id="my-video"
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
    <div
      @mouseenter="showInterfaceMouse"
      @mouseleave="hideInterfaceMouse"
      @mousemove="showInterfaceMouse"
      :class="transitionInterfaceShow"
      class="absolute bottom-0 w-full flex flex-col text-white px-2 py-1 gap-1 transition-all ease-in-out duration-500"
      v-if="isPreview"
    >
      <ProgressBar
        :style="progress"
        :value="(timer / videoElement?.duration) * 100"
        :bufferedVideo="buffered"
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
          <IconSprite name="icon-screenShot" @click.stop="screenShot" class="cursor-pointer" />
        </div>
        <div class="flex flex-row gap-3">
          <IconSprite
            @click.stop="openSelectQuality"
            name="icon-settings"
            class="hover:rotate-[60deg] duration-short cursor-pointer"
          />
          <IconSprite
            v-if="!fullscreen"
            name="icon-fullScreen"
            class="hover:scale-110 duration-short cursor-pointer"
            @click="fullScreen()"
          />
          <IconSprite
            v-else
            name="icon-smallScreen"
            class="hover:scale-20 duration-short cursor-pointer"
            @click="normalScreen()"
          />
        </div>
      </div>
    </div>

    <div
      @mouseenter="showInterfaceMouse"
      @mouseleave="hideInterfaceMouse"
      @mousemove="showInterfaceMouse"
      class="absolute text-white bottom-10 right-5 bg-gray-500 rounded-[10px] overflow-hidden"
      v-if="isQualityVideo"
    >
      <ol>
        <li
          class="cursor-pointer px-2 py-1 hover:bg-gray-700 duration-short"
          :class="{ 'bg-gray-700': quality === key, hidden: q === null }"
          v-for="(q, key) in props.AnimePlay?.list[episodeAnime]?.hls"
          :key="key"
          @click="updateQuality(key)"
        >
          {{ String(key) === 'fhd' ? 1080 : String(key) === 'hd' ? 720 : 480 }}p
        </li>
      </ol>
    </div>
  </div>
</template>
