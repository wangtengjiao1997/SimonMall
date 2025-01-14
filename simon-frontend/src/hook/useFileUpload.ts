import { useState } from 'react'

interface UseFileUploadResult {
    imageUrl: string;
    uploading: boolean;
    handleUpload: (file: File) => Promise<void>;
    error: string | null;
}

export function useFileUpload(): UseFileUploadResult {
    const [imageUrl, setImageUrl] = useState<string>('')
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleUpload = async (file: File) => {
        try {
            setUploading(true)
            setError(null)

            // 验证文件类型
            if (!file.type.startsWith('image/')) {
                throw new Error('请上传图片文件')
            }

            // 验证文件大小（例如：2MB）
            if (file.size > 2 * 1024 * 1024) {
                throw new Error('图片大小不能超过2MB')
            }

            // 创建本地 URL
            const localUrl = URL.createObjectURL(file)
            setImageUrl(localUrl)

        } catch (err) {
            setError(err instanceof Error ? err.message : '上传失败')
        } finally {
            setUploading(false)
        }
    }

    return {
        imageUrl,
        uploading,
        handleUpload,
        error
    }
}