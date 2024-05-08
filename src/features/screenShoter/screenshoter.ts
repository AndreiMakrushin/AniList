const downloadImage = (canvas: HTMLCanvasElement) => {
    const image = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = image
    link.download = 'screenshot.png'
    link.click()
  }
 export const screenShot = (el: HTMLVideoElement, width: number, height: number) => {
    if (!el) return
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d')?.drawImage(el, 0, 0)
    downloadImage(canvas)
  }