<script setup lang="ts">
import { onMounted, defineProps, ref, watch, computed, reactive, onUnmounted } from 'vue'
import Hls from 'hls.js'
import SelectEpisode from './widgetsPlayer/SelectEpisode.vue'
import Preview from './widgetsPlayer/Preview.vue'
import ProgressBar from './widgetsPlayer/ProgressBar.vue'
import Controllers from './widgetsPlayer/Controllers.vue'
import type { Anime, User } from '@/stores/types'
import noImg from '@/assets/img/noimg.jpeg'
import { screenShot } from '../../features/screenShoter/screenshoter'
import QualityVideo from './widgetsPlayer/QualityVideo.vue'
import { supabase } from '@/supabase'
import { updateAnimeHistory } from '../../features/updateAnime/updateAnime'
import { addNewAnimeHistory } from '../../features/addAnime/addAnime'

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
const playVideo = () => {
  if (isQualityVideo.value) {
    isQualityVideo.value = false
    return
  }
  if (!videoElement.value) return
  isPreview.value = true
  playing.value = true
  videoElement.value.play()
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

watch(timer, () => {
  if (!videoElement.value) return
  if (timer.value === Math.floor(videoElement.value?.duration)) {
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
  if (!videoElement.value) return
  timer.value = Math.floor(videoElement.value?.currentTime)
}

const realTimeUpdate = () => {
  const date = new Date().toLocaleDateString()
  const normalDate = date.split('.')
  const dateNormal = `${normalDate[2]}-${normalDate[1]}-${normalDate[0]}`
  const time = new Date().toLocaleTimeString()

  return `${dateNormal} ${time}`
}

watch(timer, () => {
  if (props.user === null) return
  if (timer.value < 1) return 

  updateAnimeHistory(
    props.user.id,
    props.animeId,
    episodeAnime.value,
    timer.value,
    realTimeUpdate()
  )
})
let showindTimeout: any

const showInterfaceMouse = (event: boolean) => {
  clearTimeout(showindTimeout)
  showInterface.value = true
  if (event === true) return
  showindTimeout = setTimeout(() => {
    showInterface.value = false
  }, 5000)
}
const hideInterfaceMouse = () => {
  if (!playing.value) return
  showindTimeout = setTimeout(() => {
    showInterface.value = false
  }, 5000)
}

const transitionInterfaceShow = computed(() => {
  return `${showInterface.value ? 'opacity-1 duration-short' : 'opacity-0 duration-short'}`
})

const rewindTheVideo = (e: number) => {
  if (videoElement.value) {
    videoElement.value.currentTime = e
  }
}
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.code === 'Space' && playing.value) {
    videoPaused()
  } else {
    if (event.code === 'Space' && !playing.value) {
      playVideo()
      showInterface.value = false
    }
  }
  if (event.code === 'ArrowRight' && videoElement.value) {
    videoElement.value.currentTime += 5
  }
  if (event.code === 'ArrowLeft' && videoElement.value) {
    videoElement.value.currentTime -= 5
  }
  if (event.code === 'Escape') {
    fullscreen.value = false
    normalScreen()
    
  }
  if (event.code === 'ArrowUp') {
    fullScreen()
    fullscreen.value = true
  }
  if (event.code === 'ArrowDown') {
    normalScreen()
    fullscreen.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyPress)
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress)
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
      @mouseenter="showInterfaceMouse(true)"
      @mouseleave="hideInterfaceMouse"
      @mousemove="showInterfaceMouse(true)"
      :class="transitionInterfaceShow"
      class="absolute bottom-0 w-full flex flex-col text-white px-2 py-1 gap-1 transition-all ease-in-out duration-500"
      v-if="isPreview"
    >
      <ProgressBar
        :videoCurrentTime="videoElement?.currentTime"
        :videoDurationTime="videoElement?.duration"
        @rewind="rewindTheVideo($event)"
      />
      <Controllers
        :fullscreen="fullscreen"
        :playing="playing"
        :videoTime="videoTime"
        :videoDuration="videoDuration"
        @prevEpisode="prevEpisode"
        @nextEpisode="nextEpisode"
        @playVideo="playVideo"
        @videoPaused="videoPaused"
        @screenShot="screenShot(videoElement, videoElement.videoWidth, videoElement.videoHeight)"
        @openSelectQuality="openSelectQuality"
        @fullScreen="fullScreen"
        @normalScreen="normalScreen"
      />
    </div>
    <div
      @mouseenter="showInterfaceMouse"
      @mouseleave="hideInterfaceMouse"
      @mousemove="showInterfaceMouse"
      class="absolute text-white bottom-10 right-5 bg-gray-500 rounded-[10px] overflow-hidden"
      v-if="isQualityVideo"
    >
      <QualityVideo
        :quality="quality"
        :animeQuality="props.AnimePlay?.list[episodeAnime]?.hls"
        @updateQuality="updateQuality($event)"
      />
    </div>
  </div>
</template>
