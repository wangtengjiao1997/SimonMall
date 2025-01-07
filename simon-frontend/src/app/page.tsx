'use client'
import { useButterfliesAnimation } from "@/hook/ButterfliesAnimation"
import Link from "next/link"
export default function Home() {
  const { butterfly1Ref, butterfly2Ref, leafRef } = useButterfliesAnimation()
  return (
    <main className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      <div className="container mx-auto mt-4">
        <div className="text-center mt-20 md:mt-24">
          <h1 className="text-3xl md:text-4xl text-[#516b55] font-serif relative z-10">
            Fallen Grape
          </h1>
        </div>
        {/* Main Content */}
        <div className="container mx-auto px-2 md:px-4 mt-8 md:mt-16 text-center relative">
          {/* Decorative Elements */}
          <div
            ref={leafRef}
            className="absolute top-0 right-0 hidden md:block"
          >
            <div className="w-24 md:w-32 h-24 md:h-32 bg-[#516b55] opacity-80 rounded-full blur-lg transform rotate-45" />
          </div>

          {/* Animated Butterflies */}
          <div
            ref={butterfly1Ref}
            className="absolute top-1/4 left-1/4 text-2xl md:text-4xl hidden md:block"
          >
            🦋
          </div>

          <div
            ref={butterfly2Ref}
            className="absolute top-1/3 right-1/4 text-2xl md:text-4xl hidden md:block"
          >
            🦋
          </div>

          {/* Wine Bottle */}
          <div className="relative w-32 md:w-48 h-64 md:h-96 mx-auto mb-8 md:mb-12">
            <div className="absolute inset-0 bg-[#ff7f50] rounded-lg transform -rotate-6" />
          </div>

          {/* Text Content */}
          <h2 className="text-2xl md:text-4xl font-serif text-[#516b55] mb-4 md:mb-8">It's natural.</h2>
          <p className="max-w-md mx-auto text-base md:text-lg text-[#516b55] font-light px-4">
            Natural product made with locals.
          </p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 mt-8 md:mt-10 bg-[#516b55] text-white text-lg md:text-xl font-medium rounded-md hover:bg-opacity-80 transition-colors duration-300 tracking-wider"
          >
            SHOP NOW
          </Link>
        </div>

        {/* Decorative Leaves */}
        <div className="absolute top-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-[#516b55] opacity-20 rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-[#516b55] opacity-20 rounded-full blur-xl transform translate-x-1/2 translate-y-1/2" />
      </div>
    </main>
  )
}
