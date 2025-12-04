import { useState, useRef } from 'react'
import api from '../services/api'

const ImageUpload = ({ value = [], onChange, multiple = true, maxFiles = 10 }) => {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return

    const filesToUpload = Array.from(files).slice(0, multiple ? maxFiles - value.length : 1)
    if (filesToUpload.length === 0) return

    setUploading(true)
    try {
      if (multiple) {
        const formData = new FormData()
        filesToUpload.forEach(file => formData.append('images', file))
        const res = await api.post('/upload/multiple', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        const newImages = res.data.map(img => ({ url: img.url, publicId: img.publicId }))
        onChange([...value, ...newImages])
      } else {
        const formData = new FormData()
        formData.append('image', filesToUpload[0])
        const res = await api.post('/upload/single', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        onChange([{ url: res.data.url, publicId: res.data.publicId }])
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async (index) => {
    const image = value[index]
    if (image.publicId) {
      try {
        await api.delete(`/upload/${image.publicId}`)
      } catch (error) {
        console.error('Delete failed:', error)
      }
    }
    const newValue = value.filter((_, i) => i !== index)
    onChange(newValue)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleUpload(e.dataTransfer.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const canUploadMore = multiple ? value.length < maxFiles : value.length === 0

  return (
    <div className="space-y-4">
      {canUploadMore && (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-[#7C9A82] bg-[#F5FAF6]'
              : 'border-[#EBEBEB] hover:border-[#7C9A82] hover:bg-[#FAFAF8]'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={(e) => handleUpload(e.target.files)}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-[#7C9A82] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-[14px] text-[#6B6B6B]">Đang tải lên...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 mx-auto mb-3 bg-[#F5F5F3] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-[14px] text-[#2D2D2D] font-medium mb-1">
                Kéo thả hoặc click để tải ảnh
              </p>
              <p className="text-[12px] text-[#9A9A9A]">
                PNG, JPG, WEBP (tối đa 5MB)
                {multiple && ` - Còn ${maxFiles - value.length} ảnh`}
              </p>
            </>
          )}
        </div>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {value.map((image, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={image.url || image}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover rounded-xl bg-[#F5F5F3]"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center text-[#C45C4A] opacity-0 group-hover:opacity-100 hover:bg-white transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {index === 0 && (
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#7C9A82] text-white text-[10px] font-medium rounded-lg">
                  Ảnh chính
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageUpload
