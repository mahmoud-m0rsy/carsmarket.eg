import { useLayoutEffect, useRef } from 'react'
import { ArrowDownRight, Sparkles } from 'lucide-react'
import gsap from 'gsap'

export default function Hero() {
  const root = useRef(null)
  const wheel = useRef(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline().from('.hero-line', { yPercent: 110, duration: .78, stagger: .12, ease: 'power4.out' }).from('.hero-copy', { opacity: 0, y: 18, duration: .5, stagger: .08 }, '-=.38').from(wheel.current, { x: 500, rotation: 540, scale: .76, duration: 1.15, ease: 'back.out(1.2)' }, 0).to(wheel.current, { rotation: '+=360', duration: 14, ease: 'none', repeat: -1 }, '+=.05')
    }, root)
    return () => ctx.revert()
  }, [])
  return <section ref={root} id="top" className="hero-section"><div className="shell relative grid min-h-[600px] items-end overflow-hidden py-20 lg:min-h-[690px] lg:py-28">
    <div className="relative z-10 max-w-4xl"><div className="hero-copy mb-5 flex items-center gap-2 text-xs font-bold tracking-[.2em] text-red-500"><Sparkles size={14} /> CURATED AUTOMOTIVE GOODS</div>
      <h1 className="hero-title"><span className="clip"><span className="hero-line">BUILT FOR</span></span><span className="clip"><span className="hero-line text-steel">THE <em>DRIVE.</em></span></span></h1>
      <div className="hero-copy mt-8 flex flex-wrap items-center gap-5"><p className="max-w-md text-base leading-7 text-white/60">Precision pieces for the people who see every journey as a chance to leave a mark.</p><a className="cta" href="#shop">Explore collection <ArrowDownRight size={18} /></a></div>
    </div>
    <button ref={wheel} className="wheel" aria-label="Spinning forged alloy wheel preview" onMouseEnter={() => gsap.to(wheel.current, { rotation: '+=720', duration: .9, ease: 'power2.inOut' })}><span className="rim-lip" /><span className="brake-disc" /><span className="brake-caliper" /><span className="hub" />{Array.from({ length: 10 }, (_, index) => <span className="spoke" style={{ transform: `rotate(${index * 36}deg)` }} key={index} />)}<span className="lug l1" /><span className="lug l2" /><span className="lug l3" /><span className="lug l4" /><span className="lug l5" /></button>
  </div></section>
}
