import { useState, useEffect, useRef } from 'react'
import './App.css'

// ── HOOKS ──────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
 const ref = useRef(null)
 const [inView, setInView] = useState(false)
 useEffect(() => {
 const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
 if (ref.current) obs.observe(ref.current)
 return () => obs.disconnect()
 }, [])
 return [ref, inView]
}

function useCountUp(target, duration = 2000, start = false) {
 const [val, setVal] = useState(0)
 useEffect(() => {
 if (!start) return
 let startTime = null
 const step = (ts) => {
 if (!startTime) startTime = ts
 const progress = Math.min((ts - startTime) / duration, 1)
 const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
 setVal(Math.round(eased * target))
 if (progress < 1) requestAnimationFrame(step)
 }
 requestAnimationFrame(step)
 }, [start, target, duration])
 return val
}

function useScrollProgress() {
 const [pct, setPct] = useState(0)
 useEffect(() => {
 const onScroll = () => {
 const h = document.documentElement
 const scrolled = h.scrollTop
 const total = h.scrollHeight - h.clientHeight
 setPct(total > 0 ? (scrolled / total) * 100 : 0)
 }
 window.addEventListener('scroll', onScroll, { passive: true })
 return () => window.removeEventListener('scroll', onScroll)
 }, [])
 return pct
}

function useActiveSection(ids) {
 const [active, setActive] = useState(ids[0])
 useEffect(() => {
 const obs = new IntersectionObserver(
 (entries) => {
 entries.forEach(e => { if (e.isIntersecting) setActive('#' + e.target.id) })
 },
 { rootMargin: '-40% 0px -55% 0px' }
 )
 ids.forEach(id => {
 const el = document.querySelector(id)
 if (el) obs.observe(el)
 })
 return () => obs.disconnect()
 }, [])
 return active
}

// ── ANIMATED WRAPPER ────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = '' }) {
 const [ref, inView] = useInView()
 return (
 <div ref={ref} className={`fade-in ${inView ? 'visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
 {children}
 </div>
 )
}

// ── SVG ICONS ──────────────────────────────────────────────────

const Icon = ({ name }) => {
 const icons = {
 bolt: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
 mobile: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
 search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
 pen: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
 shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
 headset: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
 check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
 arrow: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
 quote: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.956.76-3.022.66-1.065 1.515-1.867 2.558-2.403L9.373 5c-.8.396-1.56.898-2.26 1.505-.71.607-1.34 1.305-1.9 2.094s-.98 1.68-1.25 2.69-.346 2.04-.217 3.1c.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.003zm9.124 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.692-1.327-.82-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.956.76-3.022.66-1.065 1.515-1.867 2.558-2.403L18.49 5c-.8.396-1.555.898-2.26 1.505-.708.607-1.34 1.305-1.894 2.094-.556.79-.97 1.68-1.24 2.69-.273 1-.345 2.04-.217 3.1.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l-.007.004z"/></svg>,
 star: <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
 shield2: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
 zap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
 }
 return <span className="icon">{icons[name] || null}</span>
}

// ── COUNTER ────────────────────────────────────────────────────

function Counter({ target, suffix = '', prefix = '', duration = 2000 }) {
 const [ref, inView] = useInView()
 const count = useCountUp(target, duration, inView)
 return (
 <span ref={ref} className="counter">
 {prefix}{count.toLocaleString()}{suffix}
 </span>
 )
}

// ── NAV ─────────────────────────────────────────────────────────

const NAV_LINKS = [
 { label: 'Lợi ích', href: '#features' },
 { label: 'Quy trình', href: '#process' },
 { label: 'Portfolio', href: '#portfolio' },
 { label: 'Bảng giá', href: '#pricing' },
 { label: 'FAQ', href: '#faq' },
]

function Nav() {
 const [scrolled, setScrolled] = useState(false)
 const [menuOpen, setMenuOpen] = useState(false)
 const scrollPct = useScrollProgress()
 const active = useActiveSection(NAV_LINKS.map(l => l.href))

 useEffect(() => {
 const onScroll = () => setScrolled(window.scrollY > 40)
 window.addEventListener('scroll', onScroll, { passive: true })
 return () => window.removeEventListener('scroll', onScroll)
 }, [])

 return (
 <>
 {/* Reading progress bar */}
 <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />

 <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
 <div className="nav__inner container">
 <a href="#" className="nav__logo">
 <svg viewBox="0 0 120 28" className="nav__logo-svg" aria-label="GIAPTECH">
 <text x="0" y="22" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="22" fill="currentColor" letterSpacing="-1">GIAP</text>
 <text x="66" y="22" fontFamily="Inter, sans-serif" fontWeight="300" fontSize="22" fill="currentColor" letterSpacing="-1">TECH</text>
 </svg>
 </a>

 <ul className={`nav__links ${menuOpen ? 'open' : ''}`}>
 {NAV_LINKS.map(l => (
 <li key={l.href}>
 <a
 href={l.href}
 className={active === l.href ? 'active' : ''}
 onClick={() => setMenuOpen(false)}
 >
 {l.label}
 </a>
 </li>
 ))}
 </ul>

 <a href="#contact" className="btn btn--primary btn--sm nav__cta">Tư vấn ngay</a>

 <button className="nav__burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
 <span className={menuOpen ? 'open' : ''} />
 <span className={menuOpen ? 'open' : ''} />
 <span className={menuOpen ? 'open' : ''} />
 </button>
 </div>
 </nav>
 </>
 )
}

// ── HERO ────────────────────────────────────────────────────────

function Hero() {
 return (
 <section className="hero" id="home">
 {/* Floating orbs */}
 <div className="hero__orb hero__orb--1" />
 <div className="hero__orb hero__orb--2" />
 <div className="hero__orb hero__orb--3" />
 <div className="hero__bg" />

 <div className="container hero__inner">
 <FadeIn>
 <span className="hero__badge">
 <svg viewBox="0 0 8 8" width="8" height="8" fill="#3B82F6"><circle cx="4" cy="4" r="4"/></svg>
 Dịch vụ thiết kế website cao cấp
 </span>
 </FadeIn>

 <FadeIn delay={80}>
 <h1 className="hero__title">
 Website Cá Nhân<br />
 <span className="hero__title--gradient">Đẳng Cấp</span> Cho<br />
 Chuyên Gia Hàng Đầu
 </h1>
 </FadeIn>

 <FadeIn delay={160}>
 <p className="hero__sub">
 Chúng tôi không chỉ thiết kế website — chúng tôi xây dựng thương hiệu cá nhân giúp bạn thu hút khách hàng VIP và tăng doanh thu 40%.
 </p>
 </FadeIn>

 <FadeIn delay={240}>
 <div className="hero__ctas">
 <a href="#contact" className="btn btn--primary btn--lg">
 Phân tích thương hiệu miễn phí
 <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
 </a>
 <a href="#portfolio" className="btn btn--ghost btn--lg">Xem portfolio</a>
 </div>
 </FadeIn>

 <FadeIn delay={320}>
 <div className="hero__stats">
 {[
 { num: 500, suffix: '+', label: 'Chuyên gia tin dùng' },
 { num: 98, suffix: '%', label: 'Khách hàng hài lòng' },
 { num: 2, prefix: '<', suffix: 's', label: 'Tốc độ tải trang' },
 ].map(s => (
 <div className="hero__stat" key={s.label}>
 <strong>
 <Counter target={s.num} suffix={s.suffix} prefix={s.prefix} duration={1800} />
 </strong>
 <span>{s.label}</span>
 </div>
 ))}
 </div>
 </FadeIn>
 </div>
 </section>
 )
}

// ── TRUST BAR ──────────────────────────────────────────────────

function TrustBar() {
 const logos = ['FitPro', 'LuxHome', 'AutoElite', 'WealthPro', 'GlowUp', 'EduViet', 'TechStar', 'MedPro']
 return (
 <section className="trust">
 <div className="container">
 <FadeIn>
 <p className="trust__label">Tin tưởng bởi 500+ chuyên gia trên toàn quốc</p>
 </FadeIn>
 </div>
 <div className="trust__track">
 <div className="trust__logos">
 {[...logos, ...logos].map((l, i) => (
 <span className="trust__logo" key={`${l}-${i}`}>{l}</span>
 ))}
  </div>
 </div>
 </section>
 )
}

// ── PROBLEM / SOLUTION ─────────────────────────────────────────

function ProblemSolution() {
 const problems = [
 'Chỉ nhận khách qua giới thiệu, tăng trưởng chậm',
 'Không có kênh digital chuyên nghiệp để thuyết phục',
 'Thua kém đối thủ kém năng lực hơn nhưng có web đẹp hơn',
 'Mất hàng giờ giải thích "tôi là ai, tôi làm gì"',
 ]
 const solutions = [
 'Khách hàng tự tìm đến và để lại thông tin lúc nửa đêm',
 'Website cao cấp là bằng chứng sống cho chuyên môn của bạn',
 'Thoát khỏi "bẫy giá rẻ", thu hút đúng khách hàng VIP',
 'Hệ thống tự động hóa từ tiếp cận đến chốt sale',
 ]
 return (
 <section className="ps section" id="why">
 <div className="container">
 <div className="ps__grid">
 <FadeIn className="ps__col ps__col--problem">
 <span className="section-tag">
 <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 12.5a5.5 5.5 0 110-11 5.5 5.5 0 010 11zM7 4h2v5H7V4zm0 6h2v2H7v-2z"/></svg>
 Vấn đề
 </span>
 <h2>Khách hàng VIP không thể tìm thấy bạn</h2>
 <ul className="ps__list">
 {problems.map(item => (
 <li key={item}>
 <span className="ps__icon ps__icon--bad"><Icon name="bolt" /></span>
 {item}
 </li>
 ))}
 </ul>
 </FadeIn>

 <FadeIn delay={150} className="ps__col ps__col--solution">
 <span className="section-tag section-tag--blue">
 <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M6.5 1a5.5 5.5 0 014.383 8.823l4.147 4.147-.707.707L10 10.528A5.5 5.5 0 016.5 1zm0 1.5a4 4 0 100 8 4 4 0 000-8z"/></svg>
 Giải pháp GIAPTECH
 </span>
 <h2>Thương hiệu cá nhân hoạt động 24/7 thay bạn</h2>
 <ul className="ps__list">
 {solutions.map(item => (
 <li key={item}>
 <span className="ps__icon ps__icon--good"><Icon name="check" /></span>
 {item}
 </li>
 ))}
 </ul>
 </FadeIn>
 </div>
 </div>
 </section>
 )
}

// ── FEATURES ───────────────────────────────────────────────────

const FEATURES = [
 { icon: 'bolt', title: 'Tốc độ < 2 giây', desc: 'Core Web Vitals chuẩn. Google và khách hàng đều ở lại lâu hơn.' },
 { icon: 'mobile', title: 'Mobile-First', desc: '80% khách hàng dùng điện thoại. Trải nghiệm hoàn hảo trên mọi màn hình.' },
 { icon: 'search', title: 'SEO chuyên sâu', desc: 'On-page tối ưu toàn diện. Tên bạn thống lĩnh trang 1 Google.' },
 { icon: 'pen', title: 'Copywriting bán hàng', desc: 'Từng câu chữ được viết theo tâm lý học, thôi thúc hành động.' },
 { icon: 'shield', title: 'Bảo mật SSL', desc: 'HTTPS, bảo vệ dữ liệu khách hàng, không lo sập hay bị hack.' },
 { icon: 'headset', title: 'Hỗ trợ 24/7', desc: 'Bàn giao mã nguồn, đào tạo tự quản lý, hỗ trợ kỹ thuật trọn đời.' },
]

function Features() {
 return (
 <section className="section features" id="features">
 <div className="container">
 <FadeIn>
 <span className="section-tag">Tiêu chuẩn GIAPTECH</span>
 <h2 className="section-title">Không chỉ đẹp —<br />Phải <em>hiệu quả</em></h2>
 <p className="section-sub">Mỗi yếu tố đều có mục đích: chuyển đổi khách truy cập thành khách hàng trả tiền.</p>
 </FadeIn>
 <div className="features__grid">
  {FEATURES.map((f, i) => (
 <FadeIn key={f.title} delay={i * 70} className="feature-card">
 <div className="feature-card__icon-wrap">
 <Icon name={f.icon} />
 </div>
 <h3>{f.title}</h3>
 <p>{f.desc}</p>
 </FadeIn>
 ))}
 </div>
 </div>
 </section>
 )
}

// ── PROCESS ────────────────────────────────────────────────────

const STEPS = [
 { num: '01', title: 'Khai thác điểm mạnh', desc: 'Buổi call 30 phút để thấu hiểu ngành nghề, lợi thế cạnh tranh và phong cách thương hiệu.' },
 { num: '02', title: 'Thiết kế chiến lược', desc: 'Phác thảo cấu trúc, màu sắc, luồng nội dung tâm lý học. Bạn duyệt trước khi code.' },
 { num: '03', title: 'Lập trình & review', desc: 'Chuyển hóa thiết kế thành website. Bạn được xem bản preview live và góp ý trực tiếp.' },
 { num: '04', title: 'Bàn giao & vận hành', desc: 'Bàn giao toàn bộ mã nguồn, domain, hướng dẫn. Cỗ máy thu hút khách hàng chính thức bật.' },
]

function Process() {
 return (
 <section className="section process" id="process">
 <div className="container">
 <FadeIn>
 <span className="section-tag">Quy trình làm việc</span>
 <h2 className="section-title">Từ ý tưởng đến<br />website trong <em>7 ngày</em></h2>
 </FadeIn>
 <div className="process__steps">
 {STEPS.map((s, i) => (
 <FadeIn key={s.num} delay={i * 80} className="process__step">
 <div className="process__num">{s.num}</div>
 <h3>{s.title}</h3>
 <p>{s.desc}</p>
  {i < STEPS.length - 1 && <div className="process__connector" />}
 </FadeIn>
 ))}
 </div>
 </div>
 </section>
 )
}

// ── AUDIENCE ───────────────────────────────────────────────────

const TARGETS = [
 { icon: '🏋️', title: 'Personal Trainer / HLV', desc: 'Biến chứng chỉ và thành tích thành nam châm hút học viên mới mỗi ngày.' },
 { icon: '👨‍🏫', title: 'Giáo viên / Đào tạo', desc: 'Xây dựng uy tín với phụ huynh và học sinh qua hồ sơ giảng dạy chuyên nghiệp.' },
 { icon: '🏠', title: 'Môi giới Bất động sản', desc: 'Khẳng định đẳng cấp "người chơi hệ dự án lớn". Hợp đồng tiền tỷ theo sau.' },
 { icon: '🚗', title: 'Môi giới Ô tô', desc: 'Showroom ảo cá nhân sang trọng. Khách gọi điện là để chốt, không phải để hỏi.' },
 { icon: '💰', title: 'Tư vấn Tài chính / Bảo hiểm', desc: 'Đập tan hoài nghi. Xây dựng hình ảnh chuyên gia tư vấn đáng tin cậy trọn đời.' },
  { icon: '💆', title: 'Chuyên gia Thẩm mỹ / Spa', desc: 'Phô diễn những ca lột xác. Khách tranh nhau đặt lịch trước hàng tuần.' },
]

function Audience() {
 return (
 <section className="section audience" id="audience">
 <div className="container">
 <FadeIn>
 <span className="section-tag">Dành cho ai</span>
 <h2 className="section-title">Vũ khí bí mật của<br />những <em>chuyên gia đứng đầu</em></h2>
 </FadeIn>
 <div className="audience__grid">
 {TARGETS.map((t, i) => (
 <FadeIn key={t.title} delay={i * 60} className="audience-card">
 <span className="audience-card__icon">{t.icon}</span>
 <h3>{t.title}</h3>
 <p>{t.desc}</p>
 <a href="#contact" className="audience-card__cta">
 Tư vấn cho tôi <Icon name="arrow" />
 </a>
 </FadeIn>
 ))}
 </div>
 </div>
 </section>
 )
}

// ── PORTFOLIO ──────────────────────────────────────────────────

const PORTFOLIO = [
 { title: 'FitPro Nguyễn Minh', cat: 'Personal Trainer', result: '+45% học viên mới', color: '#0F172A' },
 { title: 'LuxHome Trần Hưng', cat: 'Môi giới BĐS', result: '+60% tỷ lệ chốt deal', color: '#1a1a2e' },
 { title: 'WealthPro Lê Lan', cat: 'Tư vấn tài chính', result: '+38% khách hàng mới', color: '#0F172A' },
 { title: 'GlowUp Beauty', cat: 'Chuyên gia Spa', result: 'Đặt lịch hết trong tuần', color: '#1a1a2e' },
]

function Portfolio() {
 return (
 <section className="section portfolio" id="portfolio">
 <div className="container">
 <FadeIn>
 <span className="section-tag">Portfolio</span>
 <h2 className="section-title">Mỗi dự án là<br />một <em>tác phẩm đẳng cấp</em></h2>
 </FadeIn>
 <div className="portfolio__grid">
 {PORTFOLIO.map((p, i) => (
 <FadeIn key={p.title} delay={i * 70} className="portfolio-card">
 <div className="portfolio-card__visual" style={{ background: p.color }}>
 <div className="portfolio-card__browser">
 <span /><span /><span />
 </div>
 <div className="portfolio-card__content">
 <div className="portfolio-card__line" style={{ width: '45%', height: '8px' }} />
 <div className="portfolio-card__line" style={{ width: '75%', height: '6px', marginTop: '10px' }} />
 <div className="portfolio-card__line" style={{ width: '60%', height: '6px', marginTop: '6px' }} />
 <div className="portfolio-card__btn">Khám phá</div>
 </div>
 </div>
 <div className="portfolio-card__info">
 <span className="portfolio-card__cat">{p.cat}</span>
 <h3>{p.title}</h3>
 <span className="portfolio-card__result">
 <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
 {p.result}
 </span>
 </div>
 </FadeIn>
 ))}
 </div>
 </div>
 </section>
 )
}

// ── GUARANTEE ───────────────────────────────────────────────────

function Guarantee() {
 const badges = [
 { icon: 'shield2', title: 'Cam kết hoàn tiền', desc: 'Không hài lòng sau preview đầu? Hoàn 50% đặt cọc, không câu hỏi.' },
 { icon: 'zap', title: 'Bàn giao mã nguồn', desc: '100% website thuộc về bạn. Không khóa, không phụ thuộc.' },
 { icon: 'check', title: 'Bảo hành trọn đời', desc: 'Hỗ trợ kỹ thuật dài hạn. Website sống mãi với thương hiệu.' },
 ]
 return (
 <section className="section guarantee">
 <div className="container">
 <FadeIn>
 <div className="guarantee__banner">
 <div className="guarantee__stars">
 {[1,2,3,4,5].map(n => <span key={n}><Icon name="star" /></span>)}
 </div>
 <h2>Cam kết đầu tiên trong ngành</h2>
 <p>Chúng tôi tự tin đến mức đặt ra những gì không ai dám hứa.</p>
 </div>
 </FadeIn>
 <div className="guarantee__grid">
 {badges.map((b, i) => (
 <FadeIn key={b.title} delay={i * 80} className="guarantee__badge">
 <div className="guarantee__badge-icon"><Icon name={b.icon} /></div>
 <h3>{b.title}</h3>
 <p>{b.desc}</p>
 </FadeIn>
 ))}
 </div>
 </div>
 </section>
 )
}

// ── TESTIMONIALS ───────────────────────────────────────────────

const TESTIMONIALS = [
 { name: 'Trần Minh', role: 'HLV Yoga', avatar: 'TM', text: 'Trước đây tôi chỉ nhận học viên qua giới thiệu. Sau khi có landing page, khách tự tìm đến và đặt lịch liên tục. Thu nhập tăng 40% chỉ trong 2 tháng đầu.' },
 { name: 'Nguyễn Hưng', role: 'Môi giới BĐS', avatar: 'NH', text: 'Khách hàng gọi điện đã biết tôi là ai và đã xem qua website. Họ gọi để hỏi thêm, không phải để hỏi bạn làm gì. Tỷ lệ chốt deal tăng rõ rệt.' },
 { name: 'Lê Lan', role: 'Chuyên viên tài chính', avatar: 'LL', text: 'Website cá nhân giúp tôi khác biệt hoàn toàn so với đồng nghiệp. Khách nhắn Zalo đã để lại thông tin, chỉ cần tư vấn thêm vài bước là chốt được.' },
]

function Testimonials() {
 return (
 <section className="section testimonials" id="testimonials">
 <div className="container">
 <FadeIn>
 <span className="section-tag">Khách hàng nói gì</span>
 <h2 className="section-title">Kết quả thực tế<br />từ <em>chuyên gia thực sự</em></h2>
 </FadeIn>
 <div className="testimonials__grid">
 {TESTIMONIALS.map((t, i) => (
 <FadeIn key={t.name} delay={i * 80} className="testimonial-card">
 <div className="testimonial-card__stars">
  {[1,2,3,4,5].map(n => <span key={n}><Icon name="star" /></span>)}
 </div>
 <div className="testimonial-card__quote"><Icon name="quote" /></div>
  <p className="testimonial-card__text">{t.text}</p>
 <div className="testimonial-card__author">
 <span className="testimonial-card__avatar">{t.avatar}</span>
 <div>
 <strong>{t.name}</strong>
  <span>{t.role}</span>
 </div>
 </div>
 </FadeIn>
 ))}
 </div>
 </div>
 </section>
 )
}

// ── PRICING ────────────────────────────────────────────────────

const PLANS = [
 { name: 'Starter', price: '3.9', unit: 'triệu', desc: 'Cho chuyên gia mới bắt đầu xây dựng hiện diện online', features: ['5 sections chuẩn', 'Responsive mobile', 'SEO cơ bản', 'Form liên hệ', '1 lần chỉnh sửa', 'Bàn giao mã nguồn'], cta: 'Bắt đầu ngay', highlight: false },
 { name: 'Pro', price: '6.9', unit: 'triệu', desc: 'Cho chuyên gia muốn bứt phá và tăng tỷ lệ chốt sale', features: ['10+ sections đầy đủ', 'Copywriting bán hàng', 'SEO chuyên sâu', 'Tích hợp Zalo/Messenger', '3 lần chỉnh sửa', 'Google Analytics', 'Hỗ trợ 6 tháng'], cta: 'Chọn gói Pro', highlight: true },
 { name: 'Premium', price: '12.9', unit: 'triệu', desc: 'Cho chuyên gia top ngành, cần giải pháp toàn diện', features: ['Design độc bản 100%', 'Tích hợp CRM/Booking', 'Blog + nội dung SEO', 'A/B testing setup', '5 lần chỉnh sửa', 'Bảo trì 12 tháng', 'Hỗ trợ ưu tiên 24/7'], cta: 'Tư vấn Premium', highlight: false },
]

function Pricing() {
 return (
 <section className="section pricing" id="pricing">
 <div className="container">
 <FadeIn>
 <span className="section-tag">Bảng giá</span>
 <h2 className="section-title">Đầu tư một lần<br /><em>thu về mãi mãi</em></h2>
 <p className="section-sub">Giá đã bao gồm thiết kế, lập trình, domain 1 năm và hosting 1 năm.</p>
 </FadeIn>
 <div className="pricing__grid">
 {PLANS.map((p, i) => (
 <FadeIn key={p.name} delay={i * 80} className={`pricing-card ${p.highlight ? 'pricing-card--highlight' : ''}`}>
 {p.highlight && <span className="pricing-card__badge">Phổ biến nhất</span>}
 <h3>{p.name}</h3>
 <div className="pricing-card__price">
 <strong>{p.price}</strong>
 <span>{p.unit}</span>
 </div>
 <p className="pricing-card__desc">{p.desc}</p>
 <ul className="pricing-card__features">
 {p.features.map(f => (
 <li key={f}><Icon name="check" />{f}</li>
 ))}
 </ul>
 <a href="#contact" className={`btn btn--lg ${p.highlight ? 'btn--primary' : 'btn--outline'}`}>{p.cta}</a>
 </FadeIn>
 ))}
 </div>
 </div>
 </section>
 )
}

// ── FAQ ────────────────────────────────────────────────────────

const FAQS = [
 { q: 'Bao lâu thì hoàn thành website?', a: 'Thông thường 5–7 ngày làm việc sau khi nhận đủ thông tin và nội dung từ bạn. Gói Premium có thể mất 10–14 ngày.' },
 { q: 'Tôi có cần biết kỹ thuật không?', a: 'Không cần. Chúng tôi xử lý toàn bộ phần kỹ thuật. Bạn chỉ cần cung cấp thông tin về nghề nghiệp, hình ảnh và nội dung muốn truyền tải.' },
 { q: 'Website có được bàn giao mã nguồn không?', a: 'Có. 100% mã nguồn được bàn giao cho bạn. Bạn hoàn toàn sở hữu website, không bị phụ thuộc vào chúng tôi.' },
 { q: 'Có hỗ trợ sau khi bàn giao không?', a: 'Có. Gói Starter hỗ trợ 3 tháng, Pro 6 tháng, Premium 12 tháng bảo trì và hỗ trợ kỹ thuật.' },
 { q: 'Có cam kết hoàn tiền không?', a: 'Có. Nếu bạn không hài lòng sau khi nhận bản preview đầu tiên, chúng tôi hoàn lại 50% đặt cọc, không câu hỏi thêm.' },
]

function FAQ() {
 const [open, setOpen] = useState(null)
 return (
 <section className="section faq" id="faq">
 <div className="container faq__inner">
 <FadeIn>
 <span className="section-tag">FAQ</span>
 <h2 className="section-title">Câu hỏi<br /><em>thường gặp</em></h2>
 </FadeIn>
 <div className="faq__list">
 {FAQS.map((f, i) => (
 <FadeIn key={i} delay={i * 40} className={`faq__item ${open === i ? 'open' : ''}`}>
 <button className="faq__q" onClick={() => setOpen(open === i ? null : i)}>
 {f.q}
 <span className="faq__arrow">{open === i ? '−' : '+'}</span>
 </button>
 {open === i && <p className="faq__a">{f.a}</p>}
 </FadeIn>
 ))}
 </div>
 </div>
 </section>
 )
}

// ── CONTACT ─────────────────────────────────────────────────────

function Contact() {
 const [form, setForm] = useState({ name: '', phone: '', job: '', message: '' })
 const [sent, setSent] = useState(false)
 const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
 const handleSubmit = e => { e.preventDefault(); setSent(true) }
 return (
 <section className="section contact" id="contact">
 <div className="container">
 <div className="contact__grid">
 <FadeIn className="contact__info">
 <span className="section-tag">Liên hệ</span>
 <h2 className="section-title">Bắt đầu xây dựng<br /><em>thương hiệu cá nhân</em></h2>
 <p>Điền form để nhận buổi phân tích thương hiệu miễn phí (trị giá 2 triệu đồng). Chúng tôi phản hồi trong 2 giờ làm việc.</p>
 <div className="contact__details">
 <div className="contact__detail"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>hello@giaptech.vn</div>
 <div className="contact__detail"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Zalo: 0909 123 456</div>
 <div className="contact__detail"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>TP. Hồ Chí Minh</div>
 </div>
 </FadeIn>

  <FadeIn delay={100} className="contact__form-wrap">
 {sent ? (
 <div className="contact__success">
 <div className="contact__success-icon"><Icon name="check" /></div>
 <h3>Đã nhận thông tin!</h3>
 <p>Chúng tôi sẽ liên hệ bạn trong vòng 2 giờ làm việc.</p>
 </div>
 ) : (
 <form className="contact__form" onSubmit={handleSubmit}>
 <div className="form-group">
 <label>Họ và tên *</label>
 <input name="name" value={form.name} onChange={handleChange} placeholder="Nguyễn Văn A" required />
 </div>
 <div className="form-group">
 <label>Số điện thoại *</label>
 <input name="phone" value={form.phone} onChange={handleChange} placeholder="0909 xxx xxx" required type="tel" />
 </div>
 <div className="form-group">
 <label>Nghề nghiệp</label>
 <input name="job" value={form.job} onChange={handleChange} placeholder="VD: HLV Yoga, Môi giới BĐS..." />
 </div>
 <div className="form-group">
 <label>Bạn muốn đạt được điều gì?</label>
  <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Mô tả ngắn về mục tiêu của bạn..." />
 </div>
 <button type="submit" className="btn btn--primary btn--lg btn--full">
 Nhận phân tích thương hiệu miễn phí
 <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
 </button>
 </form>
 )}
  </FadeIn>
 </div>
 </div>
 </section>
 )
}

// ── STICKY CTA ─────────────────────────────────────────────────

function StickyCta() {
 const [visible, setVisible] = useState(false)
 useEffect(() => {
 const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8)
 window.addEventListener('scroll', onScroll, { passive: true })
 return () => window.removeEventListener('scroll', onScroll)
 }, [])
 return (
 <div className={`sticky-cta ${visible ? 'visible' : ''}`}>
 <div className="sticky-cta__inner">
 <span>Website của bạn đang chờ đấy!</span>
 <a href="#contact" className="btn btn--primary btn--sm">Tư vấn miễn phí →</a>
 </div>
 </div>
 )
}

// ── FOOTER ─────────────────────────────────────────────────────

function Footer() {
 return (
 <footer className="footer">
 <div className="container footer__inner">
 <div className="footer__brand">
 <svg viewBox="0 0 120 28" className="footer__logo-svg" aria-label="GIAPTECH">
 <text x="0" y="22" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="22" fill="white" letterSpacing="-1">GIAP</text>
 <text x="66" y="22" fontFamily="Inter, sans-serif" fontWeight="300" fontSize="22" fill="white" letterSpacing="-1">TECH</text>
 </svg>
 <p>Xây dựng thương hiệu cá nhân cho chuyên gia Việt Nam.</p>
 <div className="footer__social">
 <a href="https://facebook.com/giaptech" aria-label="Facebook" target="_blank" rel="noreferrer">
 <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
 </a>
 <a href="https://zalo.me/0909123456" aria-label="Zalo" target="_blank" rel="noreferrer">
 <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><text x="3" y="18" fontSize="16" fontWeight="bold" fontFamily="Inter">Z</text></svg>
 </a>
 </div>
 </div>
 <div className="footer__links">
 <div className="footer__col">
 <h4>Dịch vụ</h4>
  <a href="#features">Tính năng</a>
 <a href="#pricing">Bảng giá</a>
 <a href="#portfolio">Portfolio</a>
 </div>
 <div className="footer__col">
 <h4>Công ty</h4>
 <a href="#why">Tại sao GIAPTECH</a>
 <a href="#testimonials">Khách hàng</a>
 <a href="#faq">FAQ</a>
 </div>
 <div className="footer__col">
 <h4>Liên hệ</h4>
 <a href="mailto:hello@giaptech.vn">hello@giaptech.vn</a>
 <a href="tel:0909123456">0909 123 456</a>
 </div>
 </div>
 </div>
 <div className="footer__bottom">
 <div className="container">
 <span>© 2025 GIAPTECH. All rights reserved.</span>
 </div>
 </div>
 </footer>
 )
}

// ── FLOATING ZALO ──────────────────────────────────────────────

function FloatingZalo() {
 return (
 <a href="https://zalo.me/0909123456" className="floating-zalo" target="_blank" rel="noreferrer" aria-label="Chat Zalo">
 <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="#0068FF"/><path d="M14 31c.2-3.2 1.6-6.1 3.9-8.3 1.4-1.4 3.5-2.7 5.9-2.7h.2c2.4 0 4.4.7 5.8 2 .7.7 1.2 1.5 1.5 2.4.1.5.2 1.1.2 1.6v1c0 2-.8 3.8-2.2 5.1-1.1 1.1-2.7 2-4.6 2.4-.5.1-1 .2-1.6.2-.3 0-.5-.1-.8-.2-.8-.2-1.4-.7-1.8-1.5-.3-.6-.4-1.3-.3-2 .1-.9.5-1.7 1.2-2.3.4-.4.9-.7 1.4-1 .5-.2 1-.3 1.6-.2.5.1.9.3 1.2.7.3.4.4.9.4 1.4h2c0-.8-.3-1.5-.7-2.1-.4-.6-1-1-1.7-1.3-.8-.3-1.6-.5-2.5-.5-.8 0-1.6.1-2.3.4-1.3.5-2.4 1.3-3.2 2.4-.5.7-.9 1.6-1.1 2.5H14v1z" fill="white"/></svg>
 </a>
 )
}

// ── APP ────────────────────────────────────────────────────────

export default function App() {
 return (
 <>
 <Nav />
 <main>
 <Hero />
 <TrustBar />
 <ProblemSolution />
 <Features />
 <Process />
 <Audience />
 <Portfolio />
 <Guarantee />
 <Testimonials />
 <Pricing />
 <FAQ />
 <Contact />
 </main>
 <Footer />
 <StickyCta />
 <FloatingZalo />
 </>
 )
}
