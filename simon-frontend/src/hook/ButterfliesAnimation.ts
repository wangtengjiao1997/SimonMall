"use client"
import { useEffect, useRef } from 'react'
import anime from 'animejs'

export function useButterfliesAnimation() {
    const butterfly1Ref = useRef(null)
    const butterfly2Ref = useRef(null)
    const leafRef = useRef(null)

    useEffect(() => {
        // 第一只蝴蝶的动画
        anime({
            targets: butterfly1Ref.current,
            translateX: [0, 100, 0],
            translateY: [0, -50, 0],
            duration: 8000,
            easing: 'easeInOutSine',
            loop: true
        })

        // 第二只蝴蝶的动画
        anime({
            targets: butterfly2Ref.current,
            translateX: [-100, 0, -100],
            translateY: [50, 0, 50],
            duration: 10000,
            easing: 'easeInOutSine',
            loop: true
        })

        // 装饰叶子的动画
        anime({
            targets: leafRef.current,
            translateX: [0, 20, 0],
            translateY: [0, -10, 0],
            duration: 4000,
            easing: 'easeInOutSine',
            loop: true
        })
    }, [])

    return { butterfly1Ref, butterfly2Ref, leafRef }
}

