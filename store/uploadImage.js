// ~/store/uploadImage.js
import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { ref } from 'vue'

export const useUploadImageStore = defineStore('uploadImage', () => {
  const { $AdminPrivateAxios: api } = useNuxtApp()
  const image_url = ref(null)

  const uploadOne = async (file, folder = 'image') => {
    if (!file) throw new Error('No file provided')
    const fd = new FormData()
    // include a filename — some servers require it
    fd.append('file', file, file.name || 'upload.jpg')
    fd.append('folder', folder)

    const res = await api.post('/uploads', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }, // override any global JSON default
    })
    image_url.value = res.data?.message.download_url || null
    if (!image_url.value) throw new Error('Upload failed: no download_url returned')
    return image_url.value
  }

  return { image_url, uploadOne }
})
