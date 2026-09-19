import { useLayoutEffect, useRef } from 'react'
import { ArrowUpRight, Gauge, Search } from 'lucide-react'
import gsap from 'gsap'

function App() {
  const heroRef = useRef(null)

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.from('[data-reveal]', { y: 28, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12 })
    }, heroRef)
    return () => context.revert()
  }, [])

  return (
    <main ref={heroRef} className="min-h-screen overflow-hidden px-6 py-8 md:px-12">
      <nav data-reveal className="mx-auto flex max-w-6xl items-center justify-between">
        <span className="text-lg font-black tracking-[.22em] text-chrome">CARSMARKET<span className="text-racing-red">.EG</span></span>
        <span className="hidden text-xs tracking-[.18em] text-chrome/55 sm:block">DRIVE WHAT MOVES YOU</span>
      </nav>
      <section className="mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-center py-16">
        <div data-reveal className="mb-5 flex items-center gap-2 text-xs font-bold tracking-[.2em] text-electric-blue"><Gauge size={16} /> THE MODERN AUTOMOTIVE MARKETPLACE</div>
        <h1 data-reveal className="max-w-4xl text-5xl font-black leading-[.92] tracking-tight text-chrome sm:text-7xl md:text-8xl">FIND YOUR NEXT <span className="text-racing-red">DRIVE.</span></h1>
        <p data-reveal className="mt-7 max-w-xl text-base leading-7 text-chrome/65 sm:text-lg">A fast, focused foundation for buying and selling exceptional cars in Egypt.</p>
        <div data-reveal className="mt-10 flex flex-wrap gap-3">
          <button className="flex items-center gap-2 bg-racing-red px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500">Browse inventory <ArrowUpRight size={17} /></button>
          <button className="metal-panel flex items-center gap-2 px-5 py-3 text-sm font-bold text-chrome transition hover:border-electric-blue/50"><Search size={17} /> Advanced search</button>
        </div>
      </section>
    </main>
  )
}

export default App
