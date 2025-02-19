'use client'
import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Product } from '@/model/product'
import anime from 'animejs'
import { QuestionType, EventQuestion, QuestionOption } from '@/model/event'

interface SelectedProduct extends Product {
    eventPrice: number;
    eventQuantity: number;
    limitPerUser: number;
}

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    products: Product[];
    merchantId: string;
}

export default function CreateEventModal({
    isOpen,
    onClose,
    onSuccess,
    products,
    merchantId
}: CreateEventModalProps) {
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([])
    const [eventInfo, setEventInfo] = useState({
        merchantId: merchantId,
        eventName: '',
        eventDescription: '',
        startTime: '',
        endTime: '',
        status: 'pending'
    })
    const [loading, setLoading] = useState(false)
    const { getToken } = useAuth()
    const [questions, setQuestions] = useState<EventQuestion[]>([])
    const [showQuestionForm, setShowQuestionForm] = useState(false)
    const [currentQuestion, setCurrentQuestion] = useState<Partial<EventQuestion>>({
        type: QuestionType.SINGLE_CHOICE,
        title: '',
        required: true,
        options: []
    })

    const handleAddProduct = (product: Product) => {
        if (!selectedProducts.find(p => p.productId === product.productId)) {
            setSelectedProducts([...selectedProducts, {
                ...product,
                eventPrice: Number(product.price), // 默认使用原价
                eventQuantity: 100, // 默认数量
                limitPerUser: 1 // 默认每人限购
            }])
            anime({
                targets: '.selected-products',
                translateX: [20, 0],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutQuad'
            })
        }
    }

    const handleRemoveProduct = (productId: string) => {
        setSelectedProducts(products => products.filter(p => p.productId !== productId))
    }

    const handleProductChange = (productId: string, field: keyof SelectedProduct, value: number) => {
        setSelectedProducts(products =>
            products.map(product =>
                product.productId === productId
                    ? { ...product, [field]: value }
                    : product
            )
        )
    }

    const handleAddQuestion = () => {
        setShowQuestionForm(true)
        setCurrentQuestion({
            type: QuestionType.SINGLE_CHOICE,
            title: '',
            required: true,
            options: []
        })
    }

    const handleQuestionSubmit = () => {
        if (!currentQuestion.title) return

        const newQuestion: EventQuestion = {
            title: currentQuestion.title,
            type: currentQuestion.type!,
            required: currentQuestion.required!,
            options: currentQuestion.type !== QuestionType.TEXT
                ? currentQuestion.options || []
                : undefined
        }

        setQuestions([...questions, newQuestion])
        setShowQuestionForm(false)
        setCurrentQuestion({
            type: QuestionType.SINGLE_CHOICE,
            title: '',
            required: true,
            options: []
        })
    }

    const handleAddOption = () => {
        setCurrentQuestion(prev => ({
            ...prev,
            options: [...(prev.options || []), '']
        }))
    }

    const handleOptionChange = (index: number, content: string) => {
        setCurrentQuestion(prev => ({
            ...prev,
            options: prev.options?.map((opt, i) => i === index ? content : opt)
        }))
    }

    const handleRemoveOption = (index: number) => {
        setCurrentQuestion(prev => ({
            ...prev,
            options: prev.options?.filter((_, i) => i !== index)
        }))
    }

    const handleRemoveQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (selectedProducts.length === 0) return

        setLoading(true)
        try {
            const token = await getToken()
            const response = await fetch('http://localhost:3001/api/v1/events/createEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...eventInfo,
                    products: selectedProducts.map(p => ({
                        productId: p.productId,
                        price: p.eventPrice,
                        quantity: p.eventQuantity,
                        limitPerUser: p.limitPerUser
                    })),
                    questions: questions.map(q => ({
                        title: q.title,
                        type: q.type,
                        required: q.required,
                        options: q.options
                    }))
                })
            })

            if (response.ok) {
                onSuccess()
                onClose()
                setSelectedProducts([])
                setEventInfo({
                    merchantId: '',
                    eventName: '',
                    eventDescription: '',
                    startTime: '',
                    endTime: '',
                    status: 'pending'
                })
            }
        } catch (error) {
            console.error('创建团购活动失败:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">创建团购活动</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        {/* 左侧：活动信息 */}
                        <div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        活动标题
                                    </label>
                                    <input
                                        type="text"
                                        value={eventInfo.eventName}
                                        onChange={(e) => setEventInfo(prev => ({ ...prev, eventName: e.target.value }))}
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#516b55]"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        活动描述
                                    </label>
                                    <textarea
                                        value={eventInfo.eventDescription}
                                        onChange={(e) => setEventInfo(prev => ({ ...prev, eventDescription: e.target.value }))}
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#516b55]"
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            开始时间
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={eventInfo.startTime}
                                            onChange={(e) => setEventInfo(prev => ({ ...prev, startTime: e.target.value }))}
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#516b55]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            结束时间
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={eventInfo.endTime}
                                            onChange={(e) => setEventInfo(prev => ({ ...prev, endTime: e.target.value }))}
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#516b55]"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 右侧：选择商品 */}
                        <div>
                            <h3 className="font-medium mb-4">选择活动商品</h3>
                            <div className="space-y-4">
                                {/* 已选商品列表 */}
                                <div className="selected-products space-y-4">
                                    {selectedProducts.map((product) => (
                                        <div key={product.productId} className="p-4 border rounded">
                                            <div className="flex gap-4 mb-4">
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-medium">{product.name}</h4>
                                                    <p className="text-sm text-gray-500">原价: ¥{product.price}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveProduct(product.productId ?? '')}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm text-gray-500 mb-1">
                                                        活动价格
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={product.eventPrice}
                                                        onChange={(e) => handleProductChange(product.productId ?? '', 'eventPrice', Number(e.target.value))}
                                                        className="w-full p-2 border rounded"
                                                        min="0"
                                                        step="0.01"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-500 mb-1">
                                                        活动库存
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={product.eventQuantity}
                                                        onChange={(e) => handleProductChange(product.productId ?? '', 'eventQuantity', Number(e.target.value))}
                                                        className="w-full p-2 border rounded"
                                                        min="1"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-500 mb-1">
                                                        每人限购
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={product.limitPerUser}
                                                        onChange={(e) => handleProductChange(product.productId ?? '', 'limitPerUser', Number(e.target.value))}
                                                        className="w-full p-2 border rounded"
                                                        min="1"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* 可选商品列表 */}
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">可选商品</h4>
                                    <div className="grid gap-2 max-h-[300px] overflow-y-auto">
                                        {products
                                            .filter(p => !selectedProducts.find(sp => sp.productId === p.productId))
                                            .map((product) => (
                                                <div
                                                    key={product.productId}
                                                    className="flex gap-4 p-2 border rounded hover:bg-gray-50 cursor-pointer"
                                                    onClick={() => handleAddProduct(product)}
                                                >
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                    <div>
                                                        <h4 className="font-medium">{product.name}</h4>
                                                        <p className="text-sm text-gray-500">¥{product.price}</p>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 问题管理部分 */}
                    <div className="mt-6 border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">问卷设置</h3>
                            <button
                                type="button"
                                onClick={handleAddQuestion}
                                className="text-sm text-[#516b55] hover:text-[#3f523f]"
                            >
                                添加问题
                            </button>
                        </div>

                        {/* 问题列表 */}
                        <div className="space-y-4">
                            {questions.map((question, index) => (
                                <div key={index} className="p-4 border rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium">{question.title}</h4>
                                            <p className="text-sm text-gray-500">
                                                {question.type === QuestionType.SINGLE_CHOICE ? '单选题' :
                                                 question.type === QuestionType.MULTIPLE_CHOICE ? '多选题' : '问答题'}
                                                {question.required && ' (必填)'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveQuestion(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            删除
                                        </button>
                                    </div>
                                    {question.options && (
                                        <div className="mt-2 space-y-1">
                                            {question.options.map((option, optIndex) => (
                                                <div key={optIndex} className="text-sm text-gray-600">
                                                    {optIndex + 1}. {option}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* 添加问题表单 */}
                        {showQuestionForm && (
                            <div className="mt-4 p-4 border rounded-lg">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            问题类型
                                        </label>
                                        <select
                                            value={currentQuestion.type}
                                            onChange={(e) => setCurrentQuestion(prev => ({
                                                ...prev,
                                                type: e.target.value as QuestionType
                                            }))}
                                            className="w-full p-2 border rounded"
                                        >
                                            <option value={QuestionType.SINGLE_CHOICE}>单选题</option>
                                            <option value={QuestionType.MULTIPLE_CHOICE}>多选题</option>
                                            <option value={QuestionType.TEXT}>问答题</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            问题标题
                                        </label>
                                        <input
                                            type="text"
                                            value={currentQuestion.title}
                                            onChange={(e) => setCurrentQuestion(prev => ({
                                                ...prev,
                                                title: e.target.value
                                            }))}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={currentQuestion.required}
                                            onChange={(e) => setCurrentQuestion(prev => ({
                                                ...prev,
                                                required: e.target.checked
                                            }))}
                                            className="mr-2"
                                        />
                                        <label className="text-sm text-gray-700">必填</label>
                                    </div>

                                    {currentQuestion.type !== QuestionType.TEXT && (
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    选项
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={handleAddOption}
                                                    className="text-sm text-[#516b55] hover:text-[#3f523f]"
                                                >
                                                    添加选项
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {currentQuestion.options?.map((option, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={option}
                                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                                            className="flex-1 p-2 border rounded"
                                                            placeholder="选项内容"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveOption(index)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            删除
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowQuestionForm(false)}
                                            className="px-4 py-2 text-gray-500 hover:text-gray-700"
                                        >
                                            取消
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleQuestionSubmit}
                                            className="px-4 py-2 bg-[#516b55] text-white rounded hover:bg-[#3f523f]"
                                        >
                                            添加问题
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            disabled={loading || selectedProducts.length === 0}
                            className={`px-6 py-2 bg-[#516b55] text-white rounded hover:bg-[#3f523f] transition-colors ${(loading || selectedProducts.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? '创建中...' : '创建活动'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}