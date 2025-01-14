interface ImageUploadProps {
    imageUrl: string;
    onUpload: (file: File) => Promise<void>;
    uploading: boolean;
    error?: string | null;
    className?: string;
}

export default function ImageUpload({
    imageUrl,
    onUpload,
    uploading,
    error,
    className = ''
}: ImageUploadProps) {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            await onUpload(file)
        }
    }

    return (
        <div className={`relative ${className}`}>
            <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="image-upload"
                disabled={uploading}
            />
            <label
                htmlFor="image-upload"
                className={`block w-full aspect-square border-2 border-dashed rounded-lg cursor-pointer
                    ${imageUrl ? 'border-transparent' : 'border-gray-300'}
                    hover:bg-gray-50 transition-colors relative overflow-hidden`}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="上传预览"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full p-4">
                        <svg
                            className="w-8 h-8 text-gray-400 mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="text-sm text-gray-500">
                            {uploading ? '上传中...' : '点击上传图片'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            支持 JPG、PNG 格式，最大 2MB
                        </p>
                    </div>
                )}
            </label>
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    )
}