import { useState, useEffect, useRef } from 'react'
import './App.css'

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView(0.5)
  useEffect(() => {
    if (!inView) return
    const end = parseInt(target)
    if (isNaN(end)) { setCount(target); return }
    let start = 0
    const timer = setInterval(() => {
      start += Math.ceil(end / (1800 / 16))
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])
  return <span ref={ref}>{isNaN(parseInt(target)) ? target : count}{suffix}</span>
}

function Section({ children, className = '', id = '' }) {
  const [ref, inView] = useInView()
  return (
    <section ref={ref} id={id} className={`section ${className} ${inView ? 'visible' : ''}`}>
      {children}
    </section>
  )
}

function TiltCard({ children, className = '', style }) {
  const cardRef = useRef(null)
  const handleMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`
  }
  const handleLeave = () => { if (cardRef.current) cardRef.current.style.transform = '' }
  return (
    <div ref={cardRef} className={className} style={{ ...style, transition: 'transform 0.15s ease' }}
      onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}
    </div>
  )
}

function RippleBtn({ children, className = '', href, type = 'button', onClick }) {
  const handleClick = (e) => {
    const btn = e.currentTarget
    const circle = document.createElement('span')
    const d = Math.max(btn.clientWidth, btn.clientHeight)
    const r = d / 2
    const rect = btn.getBoundingClientRect()
    circle.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - rect.left - r}px;top:${e.clientY - rect.top - r}px`
    circle.classList.add('ripple')
    btn.querySelector('.ripple')?.remove()
    btn.appendChild(circle)
    if (onClick) onClick(e)
  }
  if (href) return <a href={href} className={className} onClick={handleClick}>{children}</a>
  return <button type={type} className={className} onClick={handleClick}>{children}</button>
}

function Particles() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    const particles = []
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    for (let i = 0; i < 40; i++) {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1, dx: (Math.random() - 0.5) * 0.4, dy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.4 + 0.1 })
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59,130,246,${p.alpha})`; ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="particles" />
}

const benefits = [
  { icon: '≡ƒîÉ', title: '"Cß╗ù M├íy Sale" Kh├┤ng Biß║┐t Mß╗çt', desc: 'Kh├ích h├áng ├óm thß║ºm t├¼m hiß╗âu bß║ín l├║c nß╗¡a ─æ├¬m v├á ─æß╗â lß║íi th├┤ng tin khi bß║ín ─æang ngß╗º. ─Éß╗½ng bß╗Å lß╗í bß║Ñt kß╗│ c╞í hß╗Öi n├áo.' },
  { icon: '≡ƒÆÄ', title: 'Tho├ít Khß╗Åi "Bß║½y Gi├í Rß║╗"', desc: 'Giao diß╗çn sang trß╗ìng l├á minh chß╗⌐ng cho ─æß║│ng cß║Ñp. Kh├ích h├áng sß║╜ kh├┤ng kß╗│ k├¿o khi bß╗ï thuyß║┐t phß╗Ñc bß╗ƒi sß╗▒ chuy├¬n nghiß╗çp cß╗ºa bß║ín.' },
  { icon: '≡ƒôê', title: 'Tß╗▒ ─Éß╗Öng H├│a D├▓ng Kh├ích H├áng', desc: 'T├¡ch hß╗úp th├┤ng minh Form, Zalo. Bß║ín chß╗ë viß╗çc t╞░ vß║Ñn v├á chß╗æt sale, viß╗çc t├¼m kiß║┐m kh├ích h├áng ─æ├ú c├│ website lo.' },
  { icon: '≡ƒÄ»', title: '"─É├ính Xa Khß╗Åi V├╣ng An To├án"', desc: 'Tß╗æi ╞░u SEO v├á nß╗Öi dung ng├ích gi├║p tiß║┐p cß║¡n ch├¡nh x├íc ng╞░ß╗¥i ─æang khao kh├ít dß╗ïch vß╗Ñ cß╗ºa bß║ín, lß╗ìc bß╗Å kh├ích "hß╗Åi cho biß║┐t".' },
  { icon: '≡ƒñ¥', title: 'Chß╗æt Sale Tß╗½ Trong Trß╗⌐ng N╞░ß╗¢c', desc: 'Ph├┤ diß╗àn n─âng lß╗▒c qua Portfolio, chß╗⌐ng chß╗ë, Testimonials. Hß╗ì gß╗ìi cho bß║ín ─æß╗â mua, chß╗⌐ kh├┤ng phß║úi ─æß╗â hß╗Åi "bß║ín l├á ai".' },
  { icon: '≡ƒÜÇ', title: '─É├¿ Bß║╣p 90% ─Éß╗æi Thß╗º C├╣ng Ng├ánh', desc: 'Bao nhi├¬u ng╞░ß╗¥i trong ng├ánh cß╗ºa bß║ín ─æang l├ám ─æ╞░ß╗úc ─æiß╗üu n├áy? ─É├óy ch├¡nh l├á "─Éß║íi d╞░╞íng xanh" ─æß╗â bß║ín bß╗⌐t ph├í.' },
]

const features = [
  { icon: 'ΓÜí', title: 'Tß╗æc ─Éß╗Ö < 2 Gi├óy (Chuß║⌐n Core Web Vitals)', desc: 'Kh├ích h├áng thiß║┐u ki├¬n nhß║½n v├á Google c┼⌐ng vß║¡y. Ch├║ng t├┤i ─æß║úm bß║úo trß║úi nghiß╗çm m╞░ß╗út m├á, giß╗» ch├ón kh├ích ß╗ƒ lß║íi trang l├óu nhß║Ñt.' },
  { icon: '≡ƒô▒', title: 'Tß╗æi ╞»u Ho├í Mobile (Mobile-first)', desc: 'Thiß║┐t kß║┐ ─æ╞░ß╗úc ─æo ni ─æ├│ng gi├áy cho m├án h├¼nh ─æiß╗çn thoß║íi, n╞íi 80% kh├ích h├áng cß╗ºa bß║ín ─æang l╞░ß╗¢t web mß╗ùi ng├áy.' },
  { icon: '≡ƒÄ»', title: 'Nghß╗ç Thuß║¡t "Th├┤i Mi├¬n" Kh├ích H├áng', desc: 'Tß╗½ ng├┤n tß╗½ sß║»c b├⌐n ─æß║┐n t├óm l├╜ hß╗ìc m├áu sß║»c, mß╗ìi yß║┐u tß╗æ ─æß╗üu ─æ╞░ß╗úc sß║»p ─æß║╖t c├│ chß╗º ─æ├¡ch ─æß╗â th├┤i th├║c hß╗ì h├ánh ─æß╗Öng ngay.' },
  { icon: '≡ƒöì', title: 'Chuß║⌐n Mß╗▒c SEO Mß╗¢i Nhß║Ñt', desc: 'Tß╗æi ╞░u On-page to├án diß╗çn, gi├║p t├¬n tuß╗òi cß╗ºa bß║ín nhanh ch├│ng thß╗æng l─⌐nh trang nhß║Ñt Google khi kh├ích h├áng t├¼m kiß║┐m.' },
  { icon: '≡ƒ¢í∩╕Å', title: 'Hß║í Tß║ºng Vß╗»ng Nh╞░ B├án Thß║ích', desc: 'Kh├┤ng lo sß║¡p web l├║c chß║íy quß║úng c├ío hay c├│ l╞░ß╗úng truy cß║¡p ─æß╗Öt biß║┐n. Bß║úo mß║¡t tuyß╗çt ─æß╗æi mß╗ìi dß╗» liß╗çu kh├ích h├áng.' },
]

const services = [
  { icon: '≡ƒÅï∩╕Å', title: 'Personal Trainer / HLV Yoga', desc: 'Biß║┐n h├¼nh thß╗â ─æß║╣p v├á chß╗⌐ng chß╗ë th├ánh thß╗Åi nam ch├óm h├║t hß╗ìc vi├¬n. Tß╗▒ ─æß╗Öng h├│a lß╗ïch tß║¡p chuy├¬n nghiß╗çp.' },
  { icon: '≡ƒæ¿ΓÇì≡ƒÅ½', title: 'Gi├ío Vi├¬n / Chuy├¬n Gia ─É├áo Tß║ío', desc: 'X├óy dß╗▒ng niß╗üm tin tuyß╗çt ─æß╗æi vß╗¢i phß╗Ñ huynh qua bß║úng th├ánh t├¡ch ─æ├íng nß╗â v├á ph╞░╞íng ph├íp giß║úng dß║íy kh├íc biß╗çt.' },
  { icon: '≡ƒÅá', title: 'M├┤i Giß╗¢i Bß║Ñt ─Éß╗Öng Sß║ún', desc: 'Khß║│ng ─æß╗ïnh ─æß║│ng cß║Ñp "ng╞░ß╗¥i ch╞íi hß╗ç dß╗▒ ├ín lß╗¢n". Uy t├¡n ─æi tr╞░ß╗¢c, hß╗úp ─æß╗ông tiß╗ün tß╗╖ theo sau.' },
  { icon: '≡ƒÜù', title: 'M├┤i Giß╗¢i Xe ├ö T├┤', desc: 'Tß║ío showroom ß║úo c├í nh├ón cß╗▒c sang chß║únh. Kh├ích h├áng xem xe qua web, gß╗ìi ─æiß╗çn l├á ─æß╗â chß╗æt cß╗ìc.' },
  { icon: '≡ƒÆ░', title: 'Chuy├¬n Vi├¬n T├ái Ch├¡nh / Bß║úo Hiß╗âm', desc: '─Éß║¡p tan sß╗▒ ho├ái nghi cß╗ºa kh├ích h├áng. X├óy dß╗▒ng h├¼nh ß║únh chuy├¬n gia t╞░ vß║Ñn ─æ├íng tin cß║¡y trß╗ìn ─æß╗¥i.' },
  { icon: '≡ƒÆå', title: 'Chuy├¬n Gia Thß║⌐m Mß╗╣ / Spa', desc: 'Ph├┤ diß╗àn nhß╗»ng ca "lß╗Öt x├íc" thß║ºn th├ính. Kh├ích h├áng khao kh├ít l├ám ─æß║╣p v├á tranh nhau ─æß║╖t lß╗ïch tr╞░ß╗¢c h├áng tuß║ºn.' },
]

const steps = [
  { num: '01', icon: '≡ƒôï', title: 'Khai Th├íc ─Éiß╗âm Mß║ính Nhß║Ñt Cß╗ºa Bß║ín', desc: '15 ph├║t lß║»ng nghe ─æß╗â thß║Ñu hiß╗âu ng├ánh nghß╗ü, lß╗úi thß║┐ cß║ính tranh v├á ─æß╗ïnh h├¼nh phong c├ích th╞░╞íng hiß╗çu c├í nh├ón.' },
  { num: '02', icon: '≡ƒÄ¿', title: 'Ph├íc Thß║úo "V┼⌐ Kh├¡" B├ín H├áng', desc: '─Éß╗ü xuß║Ñt cß║Ñu tr├║c chiß║┐n l╞░ß╗úc, m├áu sß║»c, v├á luß╗ông nß╗Öi dung t├óm l├╜ hß╗ìc. Bß║ín sß║╜ duyß╗çt tr╞░ß╗¢c khi ch├║ng t├┤i code.' },
  { num: '03', icon: '≡ƒÆ╗', title: 'Lß║¡p Tr├¼nh & Trß║úi Nghiß╗çm Thß╗▒c Tß║┐', desc: 'Chuyß╗ân h├│a bß║ún vß║╜ th├ánh website hoß║ít ─æß╗Öng m╞░ß╗út m├á. Bß║ín ─æ╞░ß╗úc trß╗▒c tiß║┐p trß║úi nghiß╗çm bß║ún preview.' },
  { num: '04', icon: 'Γ£à', title: 'Tinh Chß╗ënh Ho├án Hß║úo', desc: 'Tß╗æi ─æa 3 lß║ºn ─æiß╗üu chß╗ënh miß╗àn ph├¡ ─æß╗â ─æß║úm bß║úo tß╗½ng c├óu chß╗», h├¼nh ß║únh ─æß╗üu sß║»c n├⌐t v├á ─æ├║ng ├╜ bß║ín 100%.' },
  { num: '05', icon: '≡ƒÜÇ', title: 'K├¡ch Hoß║ít & Thß╗æng L─⌐nh Thß╗ï Tr╞░ß╗¥ng', desc: 'B├án giao to├án bß╗Ö t├¬n miß╗ün, m├ú nguß╗ôn v├á h╞░ß╗¢ng dß║½n tß║¡n t├¼nh. Cß╗ù m├íy thu h├║t kh├ích h├áng cß╗ºa bß║ín ch├¡nh thß╗⌐c vß║¡n h├ánh.' },
]

const packages = [
  {
    name: 'Khß╗ƒi nghiß╗çp',
    price: '2.900.000─æ',
    time: '7 ng├áy',
    desc: 'Bß╗ç ph├│ng ho├án hß║úo khi bß║ín mß╗¢i bß║»t ─æß║ºu x├óy dß╗▒ng th╞░╞íng hiß╗çu c├í nh├ón online.',
    features: ['Landing page 1 trang', 'Tß╗æi ╞░u giao diß╗çn Mobile', 'Form li├¬n hß╗ç c╞í bß║ún', 'Chuß║⌐n SEO On-page', 'Ban giao toc toc 7 ng├áy'],
    missing: ['T├¬n miß╗ün ri├¬ng', 'Chß╗ënh sß╗¡a sau b├án giao'],
  },
  {
    name: 'Chuy├¬n nghiß╗çp',
    price: '5.900.000─æ',
    time: '14 ng├áy',
    featured: true,
    badge: 'GIß║óI PH├üP Tß╗ÉI ╞»U NHß║ñT',
    desc: 'D├ánh cho chuy├¬n gia muß╗æn bß╗⌐t ph├í v├á dß║½n ─æß║ºu thß╗ï phß║ºn.',
    features: ['Landing page thiß║┐t kß║┐ cao cß║Ñp', 'Hiß╗çu ß╗⌐ng Animation m╞░ß╗út m├á', 'T├¡ch hß╗úp Form & N├║t gß╗ìi/Zalo', 'Tß╗æi ╞░u SEO n├óng cao', 'Tß║╖ng T├¬n miß╗ün .com 1 n─âm', 'Ban giao 14 ng├áy', '3 lß║ºn chß╗ënh sß╗¡a miß╗àn ph├¡'],
    missing: [],
  },
  {
    name: 'Th╞░╞íng hiß╗çu',
    price: '9.900.000─æ',
    time: '21 ng├áy',
    desc: 'D├ánh cho chuy├¬n gia VIP muß╗æn x├óy dß╗▒ng hß╗ç sinh th├íi th╞░╞íng hiß╗çu bß╗ün vß╗»ng, ─æß╗Öc quyß╗ün.',
    features: ['Thiß║┐t kß║┐ Premium ─æß╗Öc bß║ún', 'Micro-interactions ─æß╗ënh cao', 'Form + T├¡ch hß╗úp Mini CRM', 'SEO chuy├¬n s├óu + Mß╗Ñc Blog', 'Tß║╖ng T├¬n miß╗ün + Hosting 1 n─âm', 'Ban giao 21 ng├áy', 'Bß║úo h├ánh & Hß╗ù trß╗ú 6 th├íng'],
    missing: [],
  },
]

const faqs = [
  {
    q: 'T├┤i ch╞░a c├│ h├¼nh ß║únh c├í nh├ón chuy├¬n nghiß╗çp th├¼ sao?',
    a: 'GIAPTECH sß║╜ t╞░ vß║Ñn concept chß╗Ñp ß║únh ph├╣ hß╗úp vß╗¢i ng├ánh nghß╗ü cß╗ºa bß║ín. Trong thß╗¥i gian bß║ín chuß║⌐n bß╗ï, ch├║ng t├┤i c├│ thß╗â sß╗¡ dß╗Ñng kho ß║únh minh hß╗ìa cao cß║Ñp c├│ bß║ún quyß╗ün ─æß╗â thiß║┐t kß║┐ tr╞░ß╗¢c cß║Ñu tr├║c v├á luß╗ông trß║úi nghiß╗çm.'
  },
  {
    q: 'Sau khi b├án giao, t├┤i c├│ phß║úi ─æ├│ng th├¬m ph├¡ duy tr├¼ kh├┤ng?',
    a: 'Vß╗¢i g├│i Khß╗ƒi nghiß╗çp, bß║ín tß╗▒ quß║ún l├╜ hosting/t├¬n miß╗ün. Vß╗¢i g├│i Chuy├¬n nghiß╗çp v├á Th╞░╞íng hiß╗çu, GIAPTECH ─æ├ú t├ái trß╗ú n─âm ─æß║ºu ti├¬n. Tß╗½ n─âm thß╗⌐ 2 trß╗ƒ ─æi, chi ph├¡ gia hß║ín theo gi├í gß╗æc nh├á cung cß║Ñp (chß╗ë khoß║úng v├ái tr─âm ngh├¼n/n─âm).'
  },
  {
    q: 'T├┤i c├│ thß╗â tß╗▒ thay ─æß╗òi nß╗Öi dung, h├¼nh ß║únh sau n├áy kh├┤ng?',
    a: 'Ho├án to├án ─æ╞░ß╗úc. Sau khi Go-live, ch├║ng t├┤i b├án giao bß╗Ö video h╞░ß╗¢ng dß║½n chi tiß║┐t c├ích tß╗▒ thay chß╗», ─æß╗òi ß║únh rß║Ñt trß╗▒c quan ΓÇö bß║ín kh├┤ng cß║ºn biß║┐t lß║¡p tr├¼nh vß║½n thao t├íc dß╗à d├áng.'
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
      <div className="faq-question">
        <span>{q}</span>
        <span className="faq-icon">{open ? 'ΓêÆ' : '+'}</span>
      </div>
      {open && <div className="faq-answer">{a}</div>}
    </div>
  )
}

export default function App() {
  const [form, setForm] = useState({ name: '', phone: '', job: '' })
  const [sent, setSent] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const handleSubmit = (e) => { e.preventDefault(); setSent(true) }

  return (
    <div className="app">

      {/* NAV */}
      <nav className="nav">
        <div className="logo">ΓÜí GIAPTECH</div>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {['benefits','features','process','services','pricing'].map((id,i) => (
            <li key={id}><a href={`#${id}`} onClick={() => setMenuOpen(false)}>
              {['Lß╗úi ├¡ch','Ti├¬u chuß║⌐n','Quy tr├¼nh','D├ánh cho ai','Bß║úng gi├í'][i]}
            </a></li>
          ))}
        </ul>
        <div className="nav-right">
          <RippleBtn href="#contact" className="btn-primary nav-cta">T╞░ vß║Ñn miß╗àn ph├¡</RippleBtn>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <Particles />
        <div className="hero-orb orb1" /><div className="hero-orb orb2" />
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge"><span className="badge-dot" />Bß╗ç Ph├│ng Th╞░╞íng Hiß╗çu C├í Nh├ón Chuy├¬n Nghiß╗çp</div>
            <h1>
              T├┤n vinh thß╗▒c t├ái ΓÇö<br />
              <span className="gradient-text">N├óng tß║ºm vß╗ï thß║┐</span>
            </h1>
            <p className="hero-desc">
              Kh├ích h├áng kh├┤ng thß╗â trß╗▒c tiß║┐p trß║úi nghiß╗çm chuy├¬n m├┤n cß╗ºa bß║ín qua m├án h├¼nh, hß╗ì ─æ├ính gi├í qua sß╗▒ chuy├¬n nghiß╗çp. ─Éß╗½ng tuß╗Öt mß║Ñt kh├ích h├áng VIP v├áo tay ─æß╗æi thß╗º chß╗ë v├¼ bß╗ü ngo├ái sß╗æ h├│a cß╗ºa hß╗ì b├│ng bß║⌐y h╞ín.
            </p>
            <div className="hero-actions">
              <RippleBtn href="#contact" className="btn-hero-primary">
                Ph├ón T├¡ch Th╞░╞íng Hiß╗çu Miß╗àn Ph├¡ (Trß╗ï gi├í 2Tr) <span className="btn-arrow">ΓåÆ</span>
              </RippleBtn>
              <a href="#benefits" className="btn-hero-ghost">Xem C├ích Ch├║ng T├┤i ─Éß╗Öt Ph├í Doanh Thu</a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><strong>2.500+</strong><span>Chuy├¬n gia tin d├╣ng</span></div>
              <div className="stat-divider" />
              <div className="hero-stat"><strong>98%</strong><span>T─âng tß╗╖ lß╗ç chß╗æt sale</span></div>
              <div className="stat-divider" />
              <div className="hero-stat"><strong>&lt;2s</strong><span>Tß╗æc ─æß╗Ö tß║úi trang</span></div>
              <div className="stat-divider" />
              <div className="hero-stat"><strong>24/7</strong><span>─Éß╗ông h├ánh hß╗ù trß╗ú</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="mockup">
              <div className="mockup-bar"><span /><span /><span /></div>
              <div className="mockup-content">
                <div className="mock-nav" />
                <div className="mock-hero">
                  <div className="mock-title" /><div className="mock-sub" /><div className="mock-btn" />
                </div>
                <div className="mock-cards">
                  <div className="mock-card" /><div className="mock-card" /><div className="mock-card" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <Section id="benefits" className="benefits-section">
        <div className="container">
          <div className="section-label">Tß║íi Sao Bß║»t Buß╗Öc Phß║úi C├│ Landing Page C├í Nh├ón?</div>
          <h2 className="section-title">6 L├╜ Do Website C├í Nh├ón Sß║╜ Thay ─Éß╗òi Ho├án To├án<br /><span className="gradient-text">C├ích Bß║ín Kiß║┐m Tiß╗ün</span></h2>
          <div className="benefits-grid">
            {benefits.map((b, i) => (
              <TiltCard key={i} className="benefit-card" style={{ '--delay': `${i * 0.1}s` }}>
                <div className="benefit-icon">{b.icon}</div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </TiltCard>
            ))}
          </div>
          <div className="benefits-cta">
            <p>≡ƒÅå <strong>Nh├ón hiß╗çu mß║ính = Kh├ích h├áng VIP = Thu nhß║¡p ─æß╗Öt ph├í. Bß║»t ─æß║ºu ngay h├┤m nay!</strong></p>
            <RippleBtn href="#contact" className="btn-primary">Bß║»t ─Éß║ºu X├óy Dß╗▒ng Ngay ΓåÆ</RippleBtn>
          </div>
        </div>
      </Section>

      {/* FEATURES */}
      <Section id="features" className="features-section">
        <div className="container">
          <div className="section-label">Ti├¬u Chuß║⌐n GIAPTECH</div>
          <h2 className="section-title">Kh├┤ng Chß╗ë L├á Web ─Éß║╣p,<br /><span className="gradient-text">Ch├║ng T├┤i X├óy Dß╗▒ng "Cß╗ù M├íy In Tiß╗ün"</span></h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <TiltCard key={i} className="feature-card" style={{ '--delay': `${i * 0.1}s` }}>
                <div className="feature-icon-wrap">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </Section>

      {/* PROCESS */}
      <Section id="process" className="process-section">
        <div className="container">
          <div className="section-label">Quy tr├¼nh l├ám viß╗çc</div>
          <h2 className="section-title">Thß╗▒c Thi Tß╗æc ─Éß╗Ö ΓÇö<br /><span className="gradient-text">Minh Bß║ích Tß╗½ng B╞░ß╗¢c</span></h2>
          <div className="steps">
            {steps.map((s, i) => (
              <div className="step" key={i} style={{ '--delay': `${i * 0.12}s` }}>
                <div className="step-left">
                  <div className="step-num">{s.num}</div>
                  {i < steps.length - 1 && <div className="step-line" />}
                </div>
                <div className="step-card">
                  <div className="step-icon">{s.icon}</div>
                  <div><h3>{s.title}</h3><p>{s.desc}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* SERVICES */}
      <Section id="services" className="services-section">
        <div className="container">
          <div className="section-label">Dß╗ïch Vß╗Ñ N├áy D├ánh Ri├¬ng Cho Ai?</div>
          <h2 className="section-title">Ch├║ng T├┤i L├á "V┼⌐ Kh├¡ B├¡ Mß║¡t" Cß╗ºa<br /><span className="gradient-text">Nhß╗»ng Chuy├¬n Gia ─Éß╗⌐ng ─Éß║ºu Ng├ánh</span></h2>
          <div className="services-grid">
            {services.map((s, i) => (
              <TiltCard key={i} className="service-card" style={{ '--delay': `${i * 0.08}s` }}>
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <a href="#contact" className="service-link">T╞░ vß║Ñn cho t├┤i ΓåÆ</a>
              </TiltCard>
            ))}
          </div>
        </div>
      </Section>


      {/* FAQ */}
      <Section id="faq" className="faq-section">
        <div className="container">
          <div className="section-label">Giß║úi ─É├íp Thß║»c Mß║»c</div>
          <h2 className="section-title">Nhß╗»ng C├óu Hß╗Åi Th╞░ß╗¥ng Gß║╖p Tr╞░ß╗¢c Khi<br /><span className="gradient-text">Khß╗ƒi Tß║ío Th╞░╞íng Hiß╗çu</span></h2>
          <div className="faq-list">
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </Section>

      {/* PRICING */}
      <Section id="pricing" className="pricing-section">
        <div className="container">
          <div className="section-label">─Éß║ºu T╞░ Nhß╗Å, Vß╗ï Thß║┐ Lß╗¢n</div>
          <h2 className="section-title">Bß║úng Gi├í Minh Bß║ích ΓÇö<br /><span className="gradient-text">Tuong Xung Voi Tam Voc Cß╗ºa Ban</span></h2>
          <p className="pricing-note">─Éß╗½ng ─æß╗æt tiß╗ün rß║úi tß╗¥ r╞íi hay chß║íy Ads v├┤ ─æß╗ïnh. Sß╗ƒ hß╗»u "Mß║╖t bß║▒ng sß╗æ" v─⌐nh viß╗àn chß╗ë bß║▒ng chi ph├¡ mß╗Öt chß║ºu nhß║¡u.</p>

          <div className="scarcity-banner">
            <span className="scarcity-fire">≡ƒöÑ</span>
            <p><strong>L╞░u ├╜:</strong> ─Éß╗â ─æß║úm bß║úo chß║Ñt l╞░ß╗úng c├í nh├ón h├│a cao nhß║Ñt, GIAPTECH chß╗ë nhß║¡n tß╗æi ─æa <strong>05 dß╗▒ ├ín/th├íng</strong>.<br /><span className="scarcity-urgent">Cß║¡p nhß║¡t: Th├íng n├áy chß╗ë c├▓n 02 vß╗ï tr├¡ trß╗æng.</span></p>
          </div>
          <div className="pricing-grid">
            {packages.map((pkg, i) => (
              <div className={`pricing-card ${pkg.featured ? 'featured' : ''}`} key={i} style={{ '--delay': `${i * 0.1}s` }}>
                {pkg.featured && <div className="featured-badge">Γ¡É {pkg.badge || 'Pho bien nhat'}</div>}
                <div className="pkg-header">
                  <h3>{pkg.name}</h3>
                  <p className="pkg-desc">{pkg.desc}</p>
                </div>
                <div className="pkg-price">
                  <span className="price">{pkg.price}</span>
                  <span className="price-note">Ban giao {pkg.time}</span>
                </div>
                <ul className="pkg-features">
                  {pkg.features.map((f, j) => <li key={j} className="ok">Γ£ô {f}</li>)}
                  {pkg.missing.map((f, j) => <li key={j} className="no">Γ£ò {f}</li>)}
                </ul>
                <RippleBtn href="#contact" className={pkg.featured ? 'btn-primary' : 'btn-outline'}>
                  T╞░ vß║Ñn g├│i n├áy ΓåÆ
                </RippleBtn>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact" className="contact-section">
        <div className="container">
          <div className="section-label">Bß║»t ─Éß║ºu Kß╗╖ Nguy├¬n Mß╗¢i Cho Th╞░╞íng Hiß╗çu</div>
          <h2 className="section-title">Nhß║¡n Lß╗Ö Tr├¼nh X├óy Dß╗▒ng Nh├ón Hiß╗çu<br /><span className="gradient-text">Ho├án To├án Miß╗àn Ph├¡</span></h2>
          <p className="contact-desc">D├ánh 15 ph├║t n├│i chuyß╗çn vß╗¢i chuy├¬n gia cß╗ºa GIAPTECH. D├╣ c├│ hß╗úp t├íc hay kh├┤ng, bß║ín c┼⌐ng sß║╜ biß║┐t ch├¡nh x├íc m├¼nh cß║ºn l├ám g├¼ tiß║┐p theo ─æß╗â bß╗⌐t ph├í thu nhß║¡p.</p>
          <div className="contact-grid">
            <div className="contact-left">
              <h3>Li├¬n hß╗ç ngay</h3>
              <a href="tel:0352425290" className="contact-method">
                <div className="method-icon">≡ƒô₧</div>
                <div><strong>Gß╗ìi ─æiß╗çn trß╗▒c tiß║┐p</strong><span>0352 425 290</span></div>
                <div className="method-arrow">ΓåÆ</div>
              </a>
              <a href="https://zalo.me/0352425290" target="_blank" rel="noreferrer" className="contact-method">
                <div className="method-icon">≡ƒÆ¼</div>
                <div><strong>Chat Zalo ngay</strong><span>0352 425 290</span></div>
                <div className="method-arrow">ΓåÆ</div>
              </a>
              <div className="response-time">
                <span>ΓÅ░</span>
                <p>Phß║ún hß╗ôi tß╗æc ─æß╗Ö trong <strong>30 ph├║t</strong> ΓÇö Hoß║ít ─æß╗Öng 8:00 ─æß║┐n 22:00 mß╗ùi ng├áy</p>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              {sent ? (
                <div className="form-success">
                  <div className="success-icon">≡ƒÄë</div>
                  <h3>─É├ú nhß║¡n th├┤ng tin cß╗ºa bß║ín!</h3>
                  <p>Chuy├¬n gia GIAPTECH sß║╜ li├¬n hß╗ç lß║íi trong v├▓ng 30 ph├║t.</p>
                </div>
              ) : (
                <>
                  <h3>─Éß╗â lß║íi th├┤ng tin</h3>
                  <div className="form-group">
                    <input type="text" placeholder="Hß╗ì v├á t├¬n chuy├¬n gia" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <input type="tel" placeholder="Sß╗æ ─æiß╗çn thoß║íi / Zalo" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <select value={form.job} onChange={e => setForm({...form, job: e.target.value})} required>
                      <option value="">L─⌐nh vß╗▒c chuy├¬n m├┤n</option>
                      <option>Huß║Ñn luyß╗çn vi├¬n PT / Yoga</option>
                      <option>Gi├ío vi├¬n / Chuy├¬n gia ─É├áo tß║ío</option>
                      <option>M├┤i giß╗¢i Bß║Ñt ─æß╗Öng sß║ún</option>
                      <option>M├┤i giß╗¢i Xe ├┤ t├┤</option>
                      <option>Chuy├¬n vi├¬n T├ái ch├¡nh / Bß║úo hiß╗âm</option>
                      <option>Chuy├¬n gia Thß║⌐m mß╗╣ / Spa</option>
                      <option>L─⌐nh vß╗▒c kh├íc</option>
                    </select>
                  </div>
                  <RippleBtn type="submit" className="btn-primary btn-full">
                    ─É─âng k├╜ nhß║¡n lß╗Ö tr├¼nh miß╗àn ph├¡ ≡ƒÜÇ
                  </RippleBtn>
                  <p className="form-privacy">≡ƒöÆ Th├┤ng tin ─æ╞░ß╗úc bß║úo mß║¡t tuyß╗çt ─æß╗æi</p>
                </>
              )}
            </form>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">ΓÜí GIAPTECH</div>
            <p>Bß╗ç ph├│ng th╞░╞íng hiß╗çu c├í nh├ón sß╗æ 1 cho chuy├¬n gia Viß╗çt</p>
          </div>
          <div className="footer-contact">
            <p>≡ƒô₧ 0352 425 290</p>
            <p>≡ƒÆ¼ Zalo: 0352 425 290</p>
            <p>≡ƒîÉ giaptech.site</p>
          </div>
        </div>
        <div className="footer-bottom">┬⌐ 2026 GIAPTECH. All rights reserved.</div>
      </footer>


      {/* MOBILE ACTION BAR */}
      <div className="mobile-action-bar">
        <a href="tel:0352425290" className="mob-btn mob-btn-outline">
          <span>≡ƒô₧</span> Gß╗ìi Ngay
        </a>
        <a href="https://zalo.me/0352425290" target="_blank" rel="noreferrer" className="mob-btn mob-btn-primary">
          <span>≡ƒÆ¼</span> Chat Zalo
        </a>
      </div>

      <button className={`scroll-top ${showTop ? 'show' : ''}`} onClick={scrollTop} aria-label="L├¬n ─æß║ºu trang">Γåæ</button>
    </div>
  )
}
