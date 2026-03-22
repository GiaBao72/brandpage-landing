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

function RippleBtn({ children, className = '', href, type = 'button', onClick, target }) {
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
  if (href) return <a href={href} className={className} onClick={handleClick} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined}>{children}</a>
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
  { icon: 'ðŸŒ', title: '"Cá»— MÃ¡y Sale" KhÃ´ng Biáº¿t Má»‡t', desc: 'KhÃ¡ch hÃ ng Ã¢m tháº§m tÃ¬m hiá»ƒu báº¡n lÃºc ná»­a Ä‘Ãªm vÃ  Ä‘á»ƒ láº¡i thÃ´ng tin khi báº¡n Ä‘ang ngá»§. Äá»«ng bá» lá»¡ báº¥t ká»³ cÆ¡ há»™i nÃ o.' },
  { icon: 'ðŸ’Ž', title: 'ThoÃ¡t Khá»i "Báº«y GiÃ¡ Ráº»"', desc: 'Giao diá»‡n sang trá»ng lÃ  minh chá»©ng cho Ä‘áº³ng cáº¥p. KhÃ¡ch hÃ ng sáº½ khÃ´ng ká»³ kÃ¨o khi bá»‹ thuyáº¿t phá»¥c bá»Ÿi sá»± chuyÃªn nghiá»‡p cá»§a báº¡n.' },
  { icon: 'ðŸ“ˆ', title: 'Tá»± Äá»™ng HÃ³a DÃ²ng KhÃ¡ch HÃ ng', desc: 'TÃ­ch há»£p thÃ´ng minh Form, Zalo. Báº¡n chá»‰ viá»‡c tÆ° váº¥n vÃ  chá»‘t sale, viá»‡c tÃ¬m kiáº¿m khÃ¡ch hÃ ng Ä‘Ã£ cÃ³ website lo.' },
  { icon: 'ðŸŽ¯', title: '"ÄÃ¡nh Xa Khá»i VÃ¹ng An ToÃ n"', desc: 'Tá»‘i Æ°u SEO vÃ  ná»™i dung ngÃ¡ch giÃºp tiáº¿p cáº­n chÃ­nh xÃ¡c ngÆ°á»i Ä‘ang khao khÃ¡t dá»‹ch vá»¥ cá»§a báº¡n, lá»c bá» khÃ¡ch "há»i cho biáº¿t".' },
  { icon: 'ðŸ¤', title: 'Chá»‘t Sale Tá»« Trong Trá»©ng NÆ°á»›c', desc: 'PhÃ´ diá»…n nÄƒng lá»±c qua Portfolio, chá»©ng chá»‰, Testimonials. Há» gá»i cho báº¡n Ä‘á»ƒ mua, chá»© khÃ´ng pháº£i Ä‘á»ƒ há»i "báº¡n lÃ  ai".' },
  { icon: 'ðŸš€', title: 'ÄÃ¨ Báº¹p 90% Äá»‘i Thá»§ CÃ¹ng NgÃ nh', desc: 'Bao nhiÃªu ngÆ°á»i trong ngÃ nh cá»§a báº¡n Ä‘ang lÃ m Ä‘Æ°á»£c Ä‘iá»u nÃ y? ÄÃ¢y chÃ­nh lÃ  "Äáº¡i dÆ°Æ¡ng xanh" Ä‘á»ƒ báº¡n bá»©t phÃ¡.' },
]

const features = [
  { icon: 'âš¡', title: 'Tá»‘c Äá»™ < 2 GiÃ¢y (Chuáº©n Core Web Vitals)', desc: 'KhÃ¡ch hÃ ng thiáº¿u kiÃªn nháº«n vÃ  Google cÅ©ng váº­y. ChÃºng tÃ´i Ä‘áº£m báº£o tráº£i nghiá»‡m mÆ°á»£t mÃ , giá»¯ chÃ¢n khÃ¡ch á»Ÿ láº¡i trang lÃ¢u nháº¥t.' },
  { icon: 'ðŸ“±', title: 'Tá»‘i Æ¯u HoÃ¡ Mobile (Mobile-first)', desc: 'Thiáº¿t káº¿ Ä‘Æ°á»£c Ä‘o ni Ä‘Ã³ng giÃ y cho mÃ n hÃ¬nh Ä‘iá»‡n thoáº¡i, nÆ¡i 80% khÃ¡ch hÃ ng cá»§a báº¡n Ä‘ang lÆ°á»›t web má»—i ngÃ y.' },
  { icon: 'ðŸŽ¯', title: 'Nghá»‡ Thuáº­t "ThÃ´i MiÃªn" KhÃ¡ch HÃ ng', desc: 'Tá»« ngÃ´n tá»« sáº¯c bÃ©n Ä‘áº¿n tÃ¢m lÃ½ há»c mÃ u sáº¯c, má»i yáº¿u tá»‘ Ä‘á»u Ä‘Æ°á»£c sáº¯p Ä‘áº·t cÃ³ chá»§ Ä‘Ã­ch Ä‘á»ƒ thÃ´i thÃºc há» hÃ nh Ä‘á»™ng ngay.' },
  { icon: 'ðŸ”', title: 'Chuáº©n Má»±c SEO Má»›i Nháº¥t', desc: 'Tá»‘i Æ°u On-page toÃ n diá»‡n, giÃºp tÃªn tuá»•i cá»§a báº¡n nhanh chÃ³ng thá»‘ng lÄ©nh trang nháº¥t Google khi khÃ¡ch hÃ ng tÃ¬m kiáº¿m.' },
  { icon: 'ðŸ›¡ï¸', title: 'Háº¡ Táº§ng Vá»¯ng NhÆ° BÃ n Tháº¡ch', desc: 'KhÃ´ng lo sáº­p web lÃºc cháº¡y quáº£ng cÃ¡o hay cÃ³ lÆ°á»£ng truy cáº­p Ä‘á»™t biáº¿n. Báº£o máº­t tuyá»‡t Ä‘á»‘i má»i dá»¯ liá»‡u khÃ¡ch hÃ ng.' },
]

const services = [
  { icon: 'ðŸ‹ï¸', title: 'Personal Trainer / HLV Yoga', desc: 'Biáº¿n hÃ¬nh thá»ƒ Ä‘áº¹p vÃ  chá»©ng chá»‰ thÃ nh thá»i nam chÃ¢m hÃºt há»c viÃªn. Tá»± Ä‘á»™ng hÃ³a lá»‹ch táº­p chuyÃªn nghiá»‡p.' },
  { icon: 'ðŸ‘¨â€ðŸ«', title: 'GiÃ¡o ViÃªn / ChuyÃªn Gia ÄÃ o Táº¡o', desc: 'XÃ¢y dá»±ng niá»m tin tuyá»‡t Ä‘á»‘i vá»›i phá»¥ huynh qua báº£ng thÃ nh tÃ­ch Ä‘Ã¡ng ná»ƒ vÃ  phÆ°Æ¡ng phÃ¡p giáº£ng dáº¡y khÃ¡c biá»‡t.' },
  { icon: 'ðŸ ', title: 'MÃ´i Giá»›i Báº¥t Äá»™ng Sáº£n', desc: 'Kháº³ng Ä‘á»‹nh Ä‘áº³ng cáº¥p "ngÆ°á»i chÆ¡i há»‡ dá»± Ã¡n lá»›n". Uy tÃ­n Ä‘i trÆ°á»›c, há»£p Ä‘á»“ng tiá»n tá»· theo sau.' },
  { icon: 'ðŸš—', title: 'MÃ´i Giá»›i Xe Ã” TÃ´', desc: 'Táº¡o showroom áº£o cÃ¡ nhÃ¢n cá»±c sang cháº£nh. KhÃ¡ch hÃ ng xem xe qua web, gá»i Ä‘iá»‡n lÃ  Ä‘á»ƒ chá»‘t cá»c.' },
  { icon: 'ðŸ’°', title: 'ChuyÃªn ViÃªn TÃ i ChÃ­nh / Báº£o Hiá»ƒm', desc: 'Äáº­p tan sá»± hoÃ i nghi cá»§a khÃ¡ch hÃ ng. XÃ¢y dá»±ng hÃ¬nh áº£nh chuyÃªn gia tÆ° váº¥n Ä‘Ã¡ng tin cáº­y trá»n Ä‘á»i.' },
  { icon: 'ðŸ’†', title: 'ChuyÃªn Gia Tháº©m Má»¹ / Spa', desc: 'PhÃ´ diá»…n nhá»¯ng ca "lá»™t xÃ¡c" tháº§n thÃ¡nh. KhÃ¡ch hÃ ng khao khÃ¡t lÃ m Ä‘áº¹p vÃ  tranh nhau Ä‘áº·t lá»‹ch trÆ°á»›c hÃ ng tuáº§n.' },
]

const steps = [
  { num: '01', icon: 'ðŸ“‹', title: 'Khai ThÃ¡c Äiá»ƒm Máº¡nh Nháº¥t Cá»§a Báº¡n', desc: '15 phÃºt láº¯ng nghe Ä‘á»ƒ tháº¥u hiá»ƒu ngÃ nh nghá», lá»£i tháº¿ cáº¡nh tranh vÃ  Ä‘á»‹nh hÃ¬nh phong cÃ¡ch thÆ°Æ¡ng hiá»‡u cÃ¡ nhÃ¢n.' },
  { num: '02', icon: 'ðŸŽ¨', title: 'PhÃ¡c Tháº£o "VÅ© KhÃ­" BÃ¡n HÃ ng', desc: 'Äá» xuáº¥t cáº¥u trÃºc chiáº¿n lÆ°á»£c, mÃ u sáº¯c, vÃ  luá»“ng ná»™i dung tÃ¢m lÃ½ há»c. Báº¡n sáº½ duyá»‡t trÆ°á»›c khi chÃºng tÃ´i code.' },
  { num: '03', icon: 'ðŸ’»', title: 'Láº­p TrÃ¬nh & Tráº£i Nghiá»‡m Thá»±c Táº¿', desc: 'Chuyá»ƒn hÃ³a báº£n váº½ thÃ nh website hoáº¡t Ä‘á»™ng mÆ°á»£t mÃ . Báº¡n Ä‘Æ°á»£c trá»±c tiáº¿p tráº£i nghiá»‡m báº£n preview.' },
  { num: '04', icon: 'âœ…', title: 'Tinh Chá»‰nh HoÃ n Háº£o', desc: 'Tá»‘i Ä‘a 3 láº§n Ä‘iá»u chá»‰nh miá»…n phÃ­ Ä‘á»ƒ Ä‘áº£m báº£o tá»«ng cÃ¢u chá»¯, hÃ¬nh áº£nh Ä‘á»u sáº¯c nÃ©t vÃ  Ä‘Ãºng Ã½ báº¡n 100%.' },
  { num: '05', icon: 'ðŸš€', title: 'KÃ­ch Hoáº¡t & Thá»‘ng LÄ©nh Thá»‹ TrÆ°á»ng', desc: 'BÃ n giao toÃ n bá»™ tÃªn miá»n, mÃ£ nguá»“n vÃ  hÆ°á»›ng dáº«n táº­n tÃ¬nh. Cá»— mÃ¡y thu hÃºt khÃ¡ch hÃ ng cá»§a báº¡n chÃ­nh thá»©c váº­n hÃ nh.' },
]

const packages = [
  {
    name: 'Khá»Ÿi nghiá»‡p',
    price: '2.900.000Ä‘',
    time: '7 ngÃ y',
    desc: 'Bá»‡ phÃ³ng hoÃ n háº£o khi báº¡n má»›i báº¯t Ä‘áº§u xÃ¢y dá»±ng thÆ°Æ¡ng hiá»‡u cÃ¡ nhÃ¢n online.',
    features: ['Landing page 1 trang', 'Tá»‘i Æ°u giao diá»‡n Mobile', 'Form liÃªn há»‡ cÆ¡ báº£n', 'Chuáº©n SEO On-page', 'Ban giao toc toc 7 ngÃ y'],
    missing: ['TÃªn miá»n riÃªng', 'Chá»‰nh sá»­a sau bÃ n giao'],
  },
  {
    name: 'ChuyÃªn nghiá»‡p',
    price: '5.900.000Ä‘',
    time: '14 ngÃ y',
    featured: true,
    badge: 'GIáº¢I PHÃP Tá»I Æ¯U NHáº¤T',
    desc: 'DÃ nh cho chuyÃªn gia muá»‘n bá»©t phÃ¡ vÃ  dáº«n Ä‘áº§u thá»‹ pháº§n.',
    features: ['Landing page thiáº¿t káº¿ cao cáº¥p', 'Hiá»‡u á»©ng Animation mÆ°á»£t mÃ ', 'TÃ­ch há»£p Form & NÃºt gá»i/Zalo', 'Tá»‘i Æ°u SEO nÃ¢ng cao', 'Táº·ng TÃªn miá»n .com 1 nÄƒm', 'Ban giao 14 ngÃ y', '3 láº§n chá»‰nh sá»­a miá»…n phÃ­'],
    missing: [],
  },
  {
    name: 'ThÆ°Æ¡ng hiá»‡u',
    price: '9.900.000Ä‘',
    time: '21 ngÃ y',
    desc: 'DÃ nh cho chuyÃªn gia VIP muá»‘n xÃ¢y dá»±ng há»‡ sinh thÃ¡i thÆ°Æ¡ng hiá»‡u bá»n vá»¯ng, Ä‘á»™c quyá»n.',
    features: ['Thiáº¿t káº¿ Premium Ä‘á»™c báº£n', 'Micro-interactions Ä‘á»‰nh cao', 'Form + TÃ­ch há»£p Mini CRM', 'SEO chuyÃªn sÃ¢u + Má»¥c Blog', 'Táº·ng TÃªn miá»n + Hosting 1 nÄƒm', 'Ban giao 21 ngÃ y', 'Báº£o hÃ nh & Há»— trá»£ 6 thÃ¡ng'],
    missing: [],
  },
]




const premiumDemos = [
  {
    id: 1,
    title: 'Xtreme Fitness â€” HLV CÃ¡ NhÃ¢n Äáº³ng Cáº¥p',
    category: 'PT / Yoga',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=85',
    link: 'https://html.designingmedia.com/xtreme-fitness/?storefront=envato-elements',
  },
  {
    id: 2,
    title: 'FiTrainer â€” ChuyÃªn Gia Huáº¥n Luyá»‡n CÃ¡ NhÃ¢n',
    category: 'PT / Yoga',
    tag: 'Exclusive',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=85',
    link: 'https://htmldesigntemplates.com/html/fitrainer/?storefront=envato-elements',
  },
  {
    id: 3,
    title: 'Zoyot â€” Studio Yoga & Wellness Cao Cáº¥p',
    category: 'PT / Yoga',
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=85',
    link: 'https://themesflat.co/html/zoyot/?storefront=envato-elements',
  },
  {
    id: 4,
    title: 'BodyShape Pro â€” Gym & Fitness Äá»‰nh Cao',
    category: 'PT / Yoga',
    tag: 'Elite',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=85',
    link: 'https://bodyshape.dexignzone.com/xhtml/index-2.html',
  },
  {
    id: 5,
    title: 'BodyShape Dark â€” PhÃ²ng Gym Premium',
    category: 'PT / Yoga',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=85',
    link: 'https://bodyshape.dexignzone.com/xhtml/index-3.html',
  },
  {
    id: 6,
    title: 'BodyShape Classic â€” ThÆ°Æ¡ng Hiá»‡u Gym Bá»n Vá»¯ng',
    category: 'PT / Yoga',
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=85',
    link: 'https://bodyshape.dexignzone.com/xhtml/index.html',
  },
  {
    id: 7,
    title: 'GymOn Dark â€” HLV & Trung TÃ¢m Gym Háº¡ng SÃ¢ng',
    category: 'PT / Yoga',
    tag: 'Elite',
    image: 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=800&q=85',
    link: 'https://winsfolio.net/html/gymon/gym-on-drak/index.html',
  },
  {
    id: 8,
    title: 'Hamilton Realty â€” MÃ´i Giá»›i BÄS Luxury',
    category: 'Báº¥t Ä‘á»™ng sáº£n',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=85',
    link: 'https://devsaidul.com/tm/html/hamilton/?storefront=envato-elements',
  },
  {
    id: 9,
    title: 'Relx Tower â€” Dá»± Ãn CÄƒn Há»™ Háº¡ng A',
    category: 'Báº¥t Ä‘á»™ng sáº£n',
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=85',
    link: 'https://htmldemo.zcubethemes.com/relxtower/?storefront=envato-elements',
  },
  {
    id: 10,
    title: 'Quarter Modern â€” BÄS Hiá»‡n Äáº¡i',
    category: 'Báº¥t Ä‘á»™ng sáº£n',
    tag: 'Elite',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=85',
    link: 'https://html.themewin.com/pixells/quarter-tailwind-preview/quarter/index-2.html',
  },
  {
    id: 11,
    title: 'Quarter Dark â€” Sá»‘ng Äáº³ng Cáº¥p',
    category: 'Báº¥t Ä‘á»™ng sáº£n',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=85',
    link: 'https://html.themewin.com/pixells/quarter-tailwind-preview/quarter/index-3.html',
  },
  {
    id: 12,
    title: 'Quarter Prestige â€” Biá»‡t Thá»± & Penthouse',
    category: 'Báº¥t Ä‘á»™ng sáº£n',
    tag: 'Exclusive',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=85',
    link: 'https://html.themewin.com/pixells/quarter-tailwind-preview/quarter/index-4.html',
  },
  {
    id: 13,
    title: 'Quarter Classic â€” Uy TÃ­n HÃ ng Äáº§u',
    category: 'Báº¥t Ä‘á»™ng sáº£n',
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=85',
    link: 'https://html.themewin.com/pixells/quarter-tailwind-preview/quarter/index.html',
  },
  {
    id: 14,
    title: 'HomPark â€” Khu ÄÃ´ Thá»‹ Äáº³ng Cáº¥p',
    category: 'Báº¥t Ä‘á»™ng sáº£n',
    tag: 'Elite',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=85',
    link: 'https://themezinho.net/hompark/?storefront=envato-elements',
  },
  {
    id: 15,
    title: 'HouseBox â€” Ná»n Táº£ng BÄS ThÃ´ng Minh',
    category: 'Báº¥t Ä‘á»™ng sáº£n',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=85',
    link: 'https://housebox-html-demo.vercel.app/?storefront=envato-elements',
  },
  {
    id: 16,
    title: 'Cardinal â€” Trung TÃ¢m Rá»­a Xe & Sá»­a Chá»¯a',
    category: 'Ã” tÃ´',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=85',
    link: 'https://demoxml.com/html/cardinal/?storefront=envato-elements',
  },
  {
    id: 17,
    title: 'Auril â€” XÆ°á»Ÿng CÆ¡ Äá»™ng CÆ¡ Háº¡ng Sang',
    category: 'Ã” tÃ´',
    tag: 'Elite',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=85',
    link: 'https://demoxml.com/html/auril/?storefront=envato-elements',
  },
  {
    id: 18,
    title: 'CarBook Classic â€” Showroom & Äáº·t Lá»‹ch Dá»‹ch Vá»¥',
    category: 'Ã” tÃ´',
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=85',
    link: 'https://winsfolio.net/html/carbook/demo-1/index.html',
  },
  {
    id: 19,
    title: 'CarBook Pro â€” Garage & ChÄƒm SÃ³c Xe Cao Cáº¥p',
    category: 'Ã” tÃ´',
    tag: 'Exclusive',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=85',
    link: 'https://winsfolio.net/html/carbook/demo-2/index.html',
  },
  {
    id: 20,
    title: 'Finance Pro â€” TÆ° Váº¥n TÃ i ChÃ­nh Cao Cáº¥p',
    category: 'TÃ i chÃ­nh',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=85',
    link: 'https://themesflat.co/html/finance/?storefront=envato-elements',
  },
  {
    id: 21,
    title: 'Finano Dark â€” ChuyÃªn Gia Äáº§u TÆ° Chá»©ng KhoÃ¡n',
    category: 'TÃ i chÃ­nh',
    tag: 'Elite',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=85',
    link: 'https://html.themexriver.com/finano/index-2.html',
  },
  {
    id: 22,
    title: 'Finano Business â€” Hoáº¡ch Äá»‹nh TÃ i ChÃ­nh Doanh Nghiá»‡p',
    category: 'TÃ i chÃ­nh',
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=85',
    link: 'https://html.themexriver.com/finano/index-3.html',
  },
  {
    id: 23,
    title: 'Finano Wealth â€” Quáº£n LÃ½ TÃ i Sáº£n Háº¡ng Sang',
    category: 'TÃ i chÃ­nh',
    tag: 'Exclusive',
    image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&q=85',
    link: 'https://html.themexriver.com/finano/index-4.html',
  },
  {
    id: 24,
    title: 'Finano Capital â€” Quá»¹ Äáº§u TÆ° & Báº£o Hiá»ƒm',
    category: 'TÃ i chÃ­nh',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=85',
    link: 'https://html.themexriver.com/finano/index-5.html',
  },
  {
    id: 25,
    title: 'Finano Classic â€” Cá»‘ Váº¥n TÃ i ChÃ­nh Uy TÃ­n',
    category: 'TÃ i chÃ­nh',
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=85',
    link: 'https://html.themexriver.com/finano/index.html',
  },
  {
    id: 26,
    title: 'Luxe Spa â€” ThÆ° GiÃ£n & ChÄƒm SÃ³c ToÃ n Diá»‡n',
    category: 'Spa / Tháº©m má»¹',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&q=85',
    link: 'https://thewebmax.org/spa/index-2.html',
  },
  {
    id: 27,
    title: 'Serenity Spa â€” Liá»‡u PhÃ¡p Äáº³ng Cáº¥p 5 Sao',
    category: 'Spa / Tháº©m má»¹',
    tag: 'Elite',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=85',
    link: 'https://thewebmax.org/spa/index-3.html',
  },
  {
    id: 28,
    title: 'Glow Studio â€” Tháº©m Má»¹ Viá»‡n Háº¡ng A',
    category: 'Spa / Tháº©m má»¹',
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=85',
    link: 'https://thewebmax.org/spa/index-4.html',
  },
  {
    id: 29,
    title: 'Belle Clinic â€” ChÄƒm SÃ³c Da & LÃ m Äáº¹p ChuyÃªn SÃ¢u',
    category: 'Spa / Tháº©m má»¹',
    tag: 'Exclusive',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=85',
    link: 'https://thewebmax.org/spa/index-5.html',
  },
  {
    id: 30,
    title: 'Zen Spa Classic â€” Massage & NÄƒng LÆ°á»£ng TÃ¢m Há»“n',
    category: 'Spa / Tháº©m má»¹',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=85',
    link: 'https://thewebmax.org/spa/index.html',
  },
  {
    id: 31,
    title: 'Examin Academy â€” Ná»n Táº£ng Há»c Online HÃ ng Äáº§u',
    category: 'GiÃ¡o dá»¥c',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=85',
    link: 'https://validthemes.net/site-template/examin/index-2.html',
  },
  {
    id: 32,
    title: 'Examin Pro â€” Trung TÃ¢m Luyá»‡n Thi Äáº¡t Äá»‰nh',
    category: 'GiÃ¡o dá»¥c',
    tag: 'Elite',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=85',
    link: 'https://validthemes.net/site-template/examin/index-3.html',
  },
  {
    id: 33,
    title: 'Examin University â€” Äáº¡i Há»c & Sau Äáº¡i Há»c',
    category: 'GiÃ¡o dá»¥c',
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=85',
    link: 'https://validthemes.net/site-template/examin/index-4.html',
  },
  {
    id: 34,
    title: 'Examin Kids â€” GiÃ¡o Dá»¥c Thiáº¿u Nhi Cháº¥t LÆ°á»£ng Cao',
    category: 'GiÃ¡o dá»¥c',
    tag: 'Exclusive',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=85',
    link: 'https://validthemes.net/site-template/examin/index-5.html',
  },
  {
    id: 35,
    title: 'Examin Skills â€” ÄÃ o Táº¡o Ká»¹ NÄƒng Nghá» Nghiá»‡p',
    category: 'GiÃ¡o dá»¥c',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=85',
    link: 'https://validthemes.net/site-template/examin/index-6.html',
  },
  {
    id: 36,
    title: 'Examin Language â€” Trung TÃ¢m Ngoáº¡i Ngá»¯ Quá»‘c Táº¿',
    category: 'GiÃ¡o dá»¥c',
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=85',
    link: 'https://validthemes.net/site-template/examin/index-7.html',
  },
  {
    id: 37,
    title: 'Examin MBA â€” ÄÃ o Táº¡o Quáº£n Trá»‹ & LÃ£nh Äáº¡o',
    category: 'GiÃ¡o dá»¥c',
    tag: 'Elite',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=85',
    link: 'https://validthemes.net/site-template/examin/index-8.html',
  },
]

const faqs = [
  {
    q: 'TÃ´i chÆ°a cÃ³ hÃ¬nh áº£nh cÃ¡ nhÃ¢n chuyÃªn nghiá»‡p thÃ¬ sao?',
    a: 'GIAPTECH sáº½ tÆ° váº¥n concept chá»¥p áº£nh phÃ¹ há»£p vá»›i ngÃ nh nghá» cá»§a báº¡n. Trong thá»i gian báº¡n chuáº©n bá»‹, chÃºng tÃ´i cÃ³ thá»ƒ sá»­ dá»¥ng kho áº£nh minh há»a cao cáº¥p cÃ³ báº£n quyá»n Ä‘á»ƒ thiáº¿t káº¿ trÆ°á»›c cáº¥u trÃºc vÃ  luá»“ng tráº£i nghiá»‡m.'
  },
  {
    q: 'Sau khi bÃ n giao, tÃ´i cÃ³ pháº£i Ä‘Ã³ng thÃªm phÃ­ duy trÃ¬ khÃ´ng?',
    a: 'Vá»›i gÃ³i Khá»Ÿi nghiá»‡p, báº¡n tá»± quáº£n lÃ½ hosting/tÃªn miá»n. Vá»›i gÃ³i ChuyÃªn nghiá»‡p vÃ  ThÆ°Æ¡ng hiá»‡u, GIAPTECH Ä‘Ã£ tÃ i trá»£ nÄƒm Ä‘áº§u tiÃªn. Tá»« nÄƒm thá»© 2 trá»Ÿ Ä‘i, chi phÃ­ gia háº¡n theo giÃ¡ gá»‘c nhÃ  cung cáº¥p (chá»‰ khoáº£ng vÃ i trÄƒm nghÃ¬n/nÄƒm).'
  },
  {
    q: 'TÃ´i cÃ³ thá»ƒ tá»± thay Ä‘á»•i ná»™i dung, hÃ¬nh áº£nh sau nÃ y khÃ´ng?',
    a: 'HoÃ n toÃ n Ä‘Æ°á»£c. Sau khi Go-live, chÃºng tÃ´i bÃ n giao bá»™ video hÆ°á»›ng dáº«n chi tiáº¿t cÃ¡ch tá»± thay chá»¯, Ä‘á»•i áº£nh ráº¥t trá»±c quan â€” báº¡n khÃ´ng cáº§n biáº¿t láº­p trÃ¬nh váº«n thao tÃ¡c dá»… dÃ ng.'
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
      <div className="faq-question">
        <span>{q}</span>
        <span className="faq-icon">{open ? 'âˆ’' : '+'}</span>
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
  const [activeTab, setActiveTab] = useState('Táº¥t cáº£')
  const portfolioTabs = ['Táº¥t cáº£', 'PT / Yoga', 'Báº¥t Ä‘á»™ng sáº£n', 'Ã” tÃ´', 'TÃ i chÃ­nh', 'Spa / Tháº©m má»¹', 'GiÃ¡o dá»¥c']
  const visibleDemos = (() => {
    if (activeTab !== 'Táº¥t cáº£') return premiumDemos.filter(d => d.category === activeTab)
    const seen = new Set()
    return premiumDemos.filter(d => {
      if (seen.has(d.category)) return false
      seen.add(d.category)
      return true
    })
  })()

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await fetch('https://formsubmit.co/ajax/vuonggiabao.7297@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          linh_vuc: form.job,
          service: form.service,
          message: form.message,
          _subject: 'Lead moi tu GIAPTECH.SITE',
          _template: 'table',
        })
      })
    } catch(_) {}
    setSent(true)
  }

  return (
    <div className="app">

      {/* NAV */}
      <nav className="nav">
        <a className="logo" href="#" onClick={e => { e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}) }}>
          <img src="/Logo.png" alt="GIAPTECH" style={{height:'40px',objectFit:'contain'}} />
        </a>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><a href="#" onClick={e => { e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); setMenuOpen(false) }}>Trang chá»§</a></li>
          {['benefits','features','process','services','portfolio','pricing'].map((id,i) => (
            <li key={id}><a href="#" onClick={e => { e.preventDefault(); const el=document.getElementById(id); if(el){el.scrollIntoView({behavior:'smooth'})} setMenuOpen(false) }}>
              {['Lá»£i Ã­ch','TiÃªu chuáº©n','Quy trÃ¬nh','DÃ nh cho ai','Portfolio','Báº£ng giÃ¡'][i]}
            </a></li>
          ))}
        </ul>
        <div className="nav-right">
          <RippleBtn href="#contact" className="btn-primary nav-cta">TÆ° váº¥n miá»…n phÃ­</RippleBtn>
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
            <div className="hero-badge"><span className="badge-dot" />Bá»‡ PhÃ³ng ThÆ°Æ¡ng Hiá»‡u CÃ¡ NhÃ¢n ChuyÃªn Nghiá»‡p</div>
            <h1>
              TÃ´n vinh thá»±c tÃ i â€”<br />
              <span className="gradient-text">NÃ¢ng táº§m vá»‹ tháº¿</span>
            </h1>
            <p className="hero-desc">
              KhÃ¡ch hÃ ng khÃ´ng thá»ƒ trá»±c tiáº¿p tráº£i nghiá»‡m chuyÃªn mÃ´n cá»§a báº¡n qua mÃ n hÃ¬nh, há» Ä‘Ã¡nh giÃ¡ qua sá»± chuyÃªn nghiá»‡p. Äá»«ng tuá»™t máº¥t khÃ¡ch hÃ ng VIP vÃ o tay Ä‘á»‘i thá»§ chá»‰ vÃ¬ bá» ngoÃ i sá»‘ hÃ³a cá»§a há» bÃ³ng báº©y hÆ¡n.
            </p>
            <div className="hero-actions">
              <RippleBtn href="#contact" className="btn-hero-primary">
                PhÃ¢n TÃ­ch ThÆ°Æ¡ng Hiá»‡u Miá»…n PhÃ­ (Trá»‹ giÃ¡ 2Tr) <span className="btn-arrow">â†’</span>
              </RippleBtn>
              <a href="#benefits" className="btn-hero-ghost">Xem CÃ¡ch ChÃºng TÃ´i Äá»™t PhÃ¡ Doanh Thu</a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><strong>2.500+</strong><span>ChuyÃªn gia tin dÃ¹ng</span></div>
              <div className="stat-divider" />
              <div className="hero-stat"><strong>98%</strong><span>TÄƒng tá»· lá»‡ chá»‘t sale</span></div>
              <div className="stat-divider" />
              <div className="hero-stat"><strong>&lt;2s</strong><span>Tá»‘c Ä‘á»™ táº£i trang</span></div>
              <div className="stat-divider" />
              <div className="hero-stat"><strong>24/7</strong><span>Äá»“ng hÃ nh há»— trá»£</span></div>
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
          <div className="section-label">Táº¡i Sao Báº¯t Buá»™c Pháº£i CÃ³ Landing Page CÃ¡ NhÃ¢n?</div>
          <h2 className="section-title">6 LÃ½ Do Website CÃ¡ NhÃ¢n Sáº½ Thay Äá»•i HoÃ n ToÃ n<br /><span className="gradient-text">CÃ¡ch Báº¡n Kiáº¿m Tiá»n</span></h2>
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
            <p>ðŸ† <strong>NhÃ¢n hiá»‡u máº¡nh = KhÃ¡ch hÃ ng VIP = Thu nháº­p Ä‘á»™t phÃ¡. Báº¯t Ä‘áº§u ngay hÃ´m nay!</strong></p>
            <RippleBtn href="#contact" className="btn-primary">Báº¯t Äáº§u XÃ¢y Dá»±ng Ngay â†’</RippleBtn>
          </div>
        </div>
      </Section>

      {/* FEATURES */}
      <Section id="features" className="features-section">
        <div className="container">
          <div className="section-label">TiÃªu Chuáº©n GIAPTECH</div>
          <h2 className="section-title">KhÃ´ng Chá»‰ LÃ  Web Äáº¹p,<br /><span className="gradient-text">ChÃºng TÃ´i XÃ¢y Dá»±ng "Cá»— MÃ¡y In Tiá»n"</span></h2>
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
          <div className="section-label">Quy trÃ¬nh lÃ m viá»‡c</div>
          <h2 className="section-title">Thá»±c Thi Tá»‘c Äá»™ â€”<br /><span className="gradient-text">Minh Báº¡ch Tá»«ng BÆ°á»›c</span></h2>
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
          <div className="section-label">Dá»‹ch Vá»¥ NÃ y DÃ nh RiÃªng Cho Ai?</div>
          <h2 className="section-title">ChÃºng TÃ´i LÃ  "VÅ© KhÃ­ BÃ­ Máº­t" Cá»§a<br /><span className="gradient-text">Nhá»¯ng ChuyÃªn Gia Äá»©ng Äáº§u NgÃ nh</span></h2>
          <div className="services-grid">
            {services.map((s, i) => (
              <TiltCard key={i} className="service-card" style={{ '--delay': `${i * 0.08}s` }}>
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <a href="#contact" className="service-link">TÆ° váº¥n cho tÃ´i â†’</a>
              </TiltCard>
            ))}
          </div>
        </div>
      </Section>





      {/* PORTFOLIO */}
      <Section id="portfolio" className="portfolio-section">
        <div className="container">
          <div className="portfolio-header">
            <div className="section-label">Kho Giao Diá»‡n Äá»™c Báº£n</div>
            <h2 className="section-title">Má»—i Dá»± Ãn LÃ  Má»™t<br /><span className="gradient-text">TÃ¡c Pháº©m Äáº³ng Cáº¥p</span></h2>
            <p className="portfolio-sub">KhÃ´ng cÃ³ template. KhÃ´ng cÃ³ báº£n sáº­y. Má»—i website Ä‘Æ°á»£c thai nghÃ©n riÃªng cho tá»«ng chuyÃªn gia.</p>
          </div>
          <div className="portfolio-filter">
            {portfolioTabs.map(tab => (
              <button
                key={tab}
                className={"pf-btn " + (activeTab === tab ? "active" : "")}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="portfolio-bento">
            {visibleDemos.map((demo, i) => (
              <TiltCard key={demo.id} className={"pf-card pf-card--" + ((i % 5 === 0) ? "wide" : (i % 5 === 3) ? "tall" : "normal")}>
                <div className="pf-img-wrap">
                  <img src={demo.image} alt={demo.title} loading="lazy" />
                  <div className="pf-overlay">
                    <RippleBtn href={demo.link} className="btn-primary pf-cta" target="_blank">
                      Xem Báº£n Live â†’
                    </RippleBtn>
                  </div>
                </div>
                <div className="pf-info">
                  <div className="pf-tags">
                    <span className="pf-tag pf-tag--cat">{demo.category}</span>
                    <span className="pf-tag pf-tag--grade">{demo.tag}</span>
                  </div>
                  <div className="pf-title">{demo.title}</div>
                </div>
              </TiltCard>
            ))}
          </div>
          <div className="portfolio-cta-wrap">
            <p>ÄÃ¢y chá»‰ lÃ  má»™t pháº§n nhá» trong portfolio cá»§a chÃºng tÃ´i.</p>
            <RippleBtn href="#contact" className="btn-primary">Nháº­n TÆ° Váº¥n Äá»ƒ Xem ToÃ n Bá»™ â†’</RippleBtn>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="faq-section">
        <div className="container">
          <div className="section-label">Giáº£i ÄÃ¡p Tháº¯c Máº¯c</div>
          <h2 className="section-title">Nhá»¯ng CÃ¢u Há»i ThÆ°á»ng Gáº·p TrÆ°á»›c Khi<br /><span className="gradient-text">Khá»Ÿi Táº¡o ThÆ°Æ¡ng Hiá»‡u</span></h2>
          <div className="faq-list">
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </Section>

      {/* PRICING */}
      <Section id="pricing" className="pricing-section">
        <div className="container">
          <div className="section-label">Äáº§u TÆ° Nhá», Vá»‹ Tháº¿ Lá»›n</div>
          <h2 className="section-title">Báº£ng GiÃ¡ Minh Báº¡ch â€”<br /><span className="gradient-text">Tuong Xung Voi Tam Voc Cá»§a Ban</span></h2>
          <p className="pricing-note">Äá»«ng Ä‘á»‘t tiá»n ráº£i tá» rÆ¡i hay cháº¡y Ads vÃ´ Ä‘á»‹nh. Sá»Ÿ há»¯u "Máº·t báº±ng sá»‘" vÄ©nh viá»…n chá»‰ báº±ng chi phÃ­ má»™t cháº§u nháº­u.</p>

          <div className="scarcity-banner">
            <span className="scarcity-fire">ðŸ”¥</span>
            <p><strong>LÆ°u Ã½:</strong> Äá»ƒ Ä‘áº£m báº£o cháº¥t lÆ°á»£ng cÃ¡ nhÃ¢n hÃ³a cao nháº¥t, GIAPTECH chá»‰ nháº­n tá»‘i Ä‘a <strong>05 dá»± Ã¡n/thÃ¡ng</strong>.<br /><span className="scarcity-urgent">Cáº­p nháº­t: ThÃ¡ng nÃ y chá»‰ cÃ²n 02 vá»‹ trÃ­ trá»‘ng.</span></p>
          </div>
          <div className="pricing-grid">
            {packages.map((pkg, i) => (
              <div className={`pricing-card ${pkg.featured ? 'featured' : ''}`} key={i} style={{ '--delay': `${i * 0.1}s` }}>
                {pkg.featured && <div className="featured-badge">â­ {pkg.badge || 'Pho bien nhat'}</div>}
                <div className="pkg-header">
                  <h3>{pkg.name}</h3>
                  <p className="pkg-desc">{pkg.desc}</p>
                </div>
                <div className="pkg-price">
                  <span className="price">{pkg.price}</span>
                  <span className="price-note">Ban giao {pkg.time}</span>
                </div>
                <ul className="pkg-features">
                  {pkg.features.map((f, j) => <li key={j} className="ok">âœ“ {f}</li>)}
                  {pkg.missing.map((f, j) => <li key={j} className="no">âœ• {f}</li>)}
                </ul>
                <RippleBtn href="#contact" className={pkg.featured ? 'btn-primary' : 'btn-outline'}>
                  TÆ° váº¥n gÃ³i nÃ y â†’
                </RippleBtn>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact" className="contact-section">
        <div className="container">
          <div className="section-label">Báº¯t Äáº§u Ká»· NguyÃªn Má»›i Cho ThÆ°Æ¡ng Hiá»‡u</div>
          <h2 className="section-title">Nháº­n Lá»™ TrÃ¬nh XÃ¢y Dá»±ng NhÃ¢n Hiá»‡u<br /><span className="gradient-text">HoÃ n ToÃ n Miá»…n PhÃ­</span></h2>
          <p className="contact-desc">DÃ nh 15 phÃºt nÃ³i chuyá»‡n vá»›i chuyÃªn gia cá»§a GIAPTECH. DÃ¹ cÃ³ há»£p tÃ¡c hay khÃ´ng, báº¡n cÅ©ng sáº½ biáº¿t chÃ­nh xÃ¡c mÃ¬nh cáº§n lÃ m gÃ¬ tiáº¿p theo Ä‘á»ƒ bá»©t phÃ¡ thu nháº­p.</p>
          <div className="contact-grid">
            <div className="contact-left">
              <h3>LiÃªn há»‡ ngay</h3>
              <a href="tel:0352425290" className="contact-method">
                <div className="method-icon">ðŸ“ž</div>
                <div><strong>Gá»i Ä‘iá»‡n trá»±c tiáº¿p</strong><span>0352 425 290</span></div>
                <div className="method-arrow">â†’</div>
              </a>
              <a href="https://zalo.me/0352425290" target="_blank" rel="noreferrer" className="contact-method">
                <div className="method-icon">ðŸ’¬</div>
                <div><strong>Chat Zalo ngay</strong><span>0352 425 290</span></div>
                <div className="method-arrow">â†’</div>
              </a>
              <a href="https://m.me/583549081512783" target="_blank" rel="noreferrer" className="contact-method">
                <div className="method-icon">ðŸ’™</div>
                <div><strong>Nháº¯n tin Messenger</strong><span>GIAPTECH</span></div>
                <div className="method-arrow">â†’</div>
              </a>
              <div className="response-time">
                <span>â°</span>
                <p>Pháº£n há»“i tá»‘c Ä‘á»™ trong <strong>30 phÃºt</strong> â€” Hoáº¡t Ä‘á»™ng 8:00 Ä‘áº¿n 22:00 má»—i ngÃ y</p>
              </div>
            </div>
            <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
              {sent ? (
                <div className="form-success">
                  <div className="success-icon">ðŸŽ‰</div>
                  <h3>ÄÃ£ nháº­n thÃ´ng tin cá»§a báº¡n!</h3>
                  <p>ChuyÃªn gia GIAPTECH sáº½ liÃªn há»‡ láº¡i trong vÃ²ng 30 phÃºt.</p>
                </div>
              ) : (
                <>
                  <h3>Äá»ƒ láº¡i thÃ´ng tin</h3>
                  <div className="form-group">
                    <input type="text" placeholder="Nháº­p tÃªn ..." required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <input type="tel" placeholder="Sá»‘ Ä‘iá»‡n thoáº¡i / Zalo" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <select value={form.job} onChange={e => setForm({...form, job: e.target.value})} required>
                      <option value="">LÄ©nh vá»±c chuyÃªn mÃ´n</option>
                      <option>Huáº¥n luyá»‡n viÃªn PT / Yoga</option>
                      <option>GiÃ¡o viÃªn / ChuyÃªn gia ÄÃ o táº¡o</option>
                      <option>MÃ´i giá»›i Báº¥t Ä‘á»™ng sáº£n</option>
                      <option>MÃ´i giá»›i Xe Ã´ tÃ´</option>
                      <option>ChuyÃªn viÃªn TÃ i chÃ­nh / Báº£o hiá»ƒm</option>
                      <option>ChuyÃªn gia Tháº©m má»¹ / Spa</option>
                      <option>LÄ©nh vá»±c khÃ¡c</option>
                    </select>
                  </div>
                  <RippleBtn type="submit" className="btn-primary btn-full">
                    ÄÄƒng kÃ½ nháº­n lá»™ trÃ¬nh miá»…n phÃ­ ðŸš€
                  </RippleBtn>
                  <p className="form-privacy">ðŸ”’ ThÃ´ng tin Ä‘Æ°á»£c báº£o máº­t tuyá»‡t Ä‘á»‘i</p>
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
            <div className="footer-logo">âš¡ GIAPTECH</div>
            <p>Bá»‡ phÃ³ng thÆ°Æ¡ng hiá»‡u cÃ¡ nhÃ¢n sá»‘ 1 cho chuyÃªn gia Viá»‡t</p>
          </div>
          <div className="footer-contact">
            <p>ðŸ“ž 0352 425 290</p>
            <p>ðŸ’¬ Zalo: 0352 425 290</p>
            <p>ðŸŒ giaptech.site</p>
          </div>
        </div>
        <div className="footer-bottom">Â© 2026 GIAPTECH. All rights reserved.</div>
      </footer>


      {/* MOBILE ACTION BAR */}
      <div className="mobile-action-bar">
        <a href="#" onClick={e => { e.preventDefault(); const el = document.getElementById('contact-form'); if(el){ el.scrollIntoView({behavior:'smooth', block:'center'}) } }} className="mob-btn mob-btn-outline">
          <span>ðŸ“</span> Gá»­i ThÃ´ng Tin
        </a>
        <a href="https://zalo.me/0352425290" target="_blank" rel="noreferrer" className="mob-btn mob-btn-primary">
          <span>ðŸ’¬</span> Chat Zalo
        </a>
      </div>

      <button className={`scroll-top ${showTop ? 'show' : ''}`} onClick={scrollTop} aria-label="LÃªn Ä‘áº§u trang">â†‘</button>
      <a href="https://m.me/583549081512783" target="_blank" rel="noreferrer" className="messenger-bubble" aria-label="Chat Messenger">
        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.906 1.404 5.497 3.6 7.22V22l3.25-1.786A10.5 10.5 0 0012 20.486c5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.07 12.44l-2.55-2.72-4.98 2.72 5.48-5.82 2.61 2.72 4.92-2.72-5.48 5.82z"/></svg>
      </a>
    </div>
  )
}

