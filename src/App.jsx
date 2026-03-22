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
  { icon: '🌐', title: '"Co May Sale" Khong Biet Met', desc: 'Khach hang am tham tim hieu ban luc nua dem va de lai thong tin khi ban dang ngu. Dung bo lo bat ky co hoi nao.' },
  { icon: '💎', title: 'Thoat Khoi "Bay Gia Re"', desc: 'Giao dien sang trong la minh chung cho dang cap. Khach hang se khong ky keo khi bi thuyet phuc boi su chuyen nghiep cua ban.' },
  { icon: '📈', title: 'Tu Dong Hoa Dong Khach Hang', desc: 'Tich hop thong minh Form, Zalo. Ban chi viec tu van va chot sale, viec tim kiem khach hang da co website lo.' },
  { icon: '🎯', title: '"Danh Xa Khoi Vung An Toan"', desc: 'Toi uu SEO va noi dung ngach giup tiep can chinh xac nguoi dang khao khat dich vu cua ban, loc bo khach "hoi cho biet".' },
  { icon: '🤝', title: 'Chot Sale Tu Trong Trung Nuoc', desc: 'Pho dien nang luc qua Portfolio, chung chi, Testimonials. Ho goi cho ban de mua, chu khong phai de hoi "ban la ai".' },
  { icon: '🚀', title: 'De Bep 90% Doi Thu Cung Nganh', desc: 'Bao nhieu nguoi trong nganh cua ban dang lam duoc dieu nay? Day chinh la "Dai duong xanh" de ban but pha.' },
]

const features = [
  { icon: '⚡', title: 'Toc Do < 2 Giay (Chuan Core Web Vitals)', desc: 'Khach hang thieu kien nhan va Google cung vay. Chung toi dam bao trai nghiem muot ma, giu chan khach o lai trang lau nhat.' },
  { icon: '📱', title: 'Toi Uu Hoa Mobile (Mobile-first)', desc: 'Thiet ke duoc do ni dong giay cho man hinh dien thoai, noi 80% khach hang cua ban dang luot web moi ngay.' },
  { icon: '🎯', title: 'Nghe Thuat "Thoi Mien" Khach Hang', desc: 'Tu ngon tu sac ben den tam ly hoc mau sac, moi yeu to deu duoc sap dat co chu dich de thoi thuc ho hanh dong ngay.' },
  { icon: '🔍', title: 'Chuan Muc SEO Moi Nhat', desc: 'Toi uu On-page toan dien, giup ten tuoi cua ban nhanh chong thong linh trang nhat Google khi khach hang tim kiem.' },
  { icon: '🛡️', title: 'Ha Tang Vung Nhu Ban Thach', desc: 'Khong lo sap web luc chay quang cao hay co luong truy cap dot bien. Bao mat tuyet doi moi du lieu khach hang.' },
]

const services = [
  { icon: '🏋️', title: 'Personal Trainer / HLV Yoga', desc: 'Bien hinh the dep va chung chi thanh thoi nam cham hut hoc vien. Tu dong hoa lich tap chuyen nghiep.' },
  { icon: '👨‍🏫', title: 'Giao Vien / Chuyen Gia Dao Tao', desc: 'Xay dung niem tin tuyet doi voi phu huynh qua bang thanh tich dang ne va phuong phap giang day khac biet.' },
  { icon: '🏠', title: 'Moi Gioi Bat Dong San', desc: 'Khang dinh dang cap "nguoi choi he du an lon". Uy tin di truoc, hop dong tien ty theo sau.' },
  { icon: '🚗', title: 'Moi Gioi Xe O To', desc: 'Tao showroom ao ca nhan cuc sang chanh. Khach hang xem xe qua web, goi dien la de chot coc.' },
  { icon: '💰', title: 'Chuyen Vien Tai Chinh / Bao Hiem', desc: 'Dap tan su hoai nghi cua khach hang. Xay dung hinh anh chuyen gia tu van dang tin cay tron doi.' },
  { icon: '💆', title: 'Chuyen Gia Tham My / Spa', desc: 'Pho dien nhung ca "lot xac" than thanh. Khach hang khao khat lam dep va tranh nhau dat lich truoc hang tuan.' },
]

const steps = [
  { num: '01', icon: '📋', title: 'Khai Thac Diem Manh Nhat Cua Ban', desc: '15 phut lang nghe de thau hieu nganh nghe, loi the canh tranh va dinh hinh phong cach thuong hieu ca nhan.' },
  { num: '02', icon: '🎨', title: 'Phac Thao "Vu Khi" Ban Hang', desc: 'De xuat cau truc chien luoc, mau sac, va luong noi dung tam ly hoc. Ban se duyet truoc khi chung toi code.' },
  { num: '03', icon: '💻', title: 'Lap Trinh & Trai Nghiem Thuc Te', desc: 'Chuyen hoa ban ve thanh website hoat dong muot ma. Ban duoc truc tiep trai nghiem ban preview.' },
  { num: '04', icon: '✅', title: 'Tinh Chinh Hoan Hao', desc: 'Toi da 3 lan dieu chinh mien phi de dam bao tung cau chu, hinh anh deu sac net va dung y ban 100%.' },
  { num: '05', icon: '🚀', title: 'Kich Hoat & Thong Linh Thi Truong', desc: 'Ban giao toan bo ten mien, ma nguon va huong dan tan tinh. Co may thu hut khach hang cua ban chinh thuc van hanh.' },
]

const packages = [
  {
    name: 'Khoi nghiep',
    price: '2.900.000d',
    time: '7 ngay',
    desc: 'Be phong hoan hao khi ban moi bat dau xay dung thuong hieu ca nhan online.',
    features: ['Landing page 1 trang', 'Toi uu giao dien Mobile', 'Form lien he co ban', 'Chuan SEO On-page', 'Ban giao toc toc 7 ngay'],
    missing: ['Ten mien rieng', 'Chinh sua sau ban giao'],
  },
  {
    name: 'Chuyen nghiep',
    price: '5.900.000d',
    time: '14 ngay',
    featured: true,
    badge: 'GIAI PHAP TOI UU NHAT',
    desc: 'Danh cho chuyen gia muon but pha va dan dau thi phan.',
    features: ['Landing page thiet ke cao cap', 'Hieu ung Animation muot ma', 'Tich hop Form & Nut goi/Zalo', 'Toi uu SEO nang cao', 'Tang Ten mien .com 1 nam', 'Ban giao 14 ngay', '3 lan chinh sua mien phi'],
    missing: [],
  },
  {
    name: 'Thuong hieu',
    price: '9.900.000d',
    time: '21 ngay',
    desc: 'Danh cho chuyen gia VIP muon xay dung he sinh thai thuong hieu ben vung, doc quyen.',
    features: ['Thiet ke Premium doc ban', 'Micro-interactions dinh cao', 'Form + Tich hop Mini CRM', 'SEO chuyen sau + Muc Blog', 'Tang Ten mien + Hosting 1 nam', 'Ban giao 21 ngay', 'Bao hanh & Ho tro 6 thang'],
    missing: [],
  },
]

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
        <div className="logo">⚡ GIAPTECH</div>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {['benefits','features','process','services','pricing'].map((id,i) => (
            <li key={id}><a href={`#${id}`} onClick={() => setMenuOpen(false)}>
              {['Loi ich','Tieu chuan','Quy trinh','Danh cho ai','Bang gia'][i]}
            </a></li>
          ))}
        </ul>
        <div className="nav-right">
          <RippleBtn href="#contact" className="btn-primary nav-cta">Tu van mien phi</RippleBtn>
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
            <div className="hero-badge"><span className="badge-dot" />Be Phong Thuong Hieu Ca Nhan Chuyen Nghiep</div>
            <h1>
              Nang luc cua ban xung dang duoc tra gia cao hon.<br />
              <span className="gradient-text">Dung de khach hang chon doi thu chi vi ho co ve ngoai bong bay hon.</span>
            </h1>
            <p className="hero-desc">
              Trong thoi dai so, "huu xa tu nhien huong" la chua du. GIAPTECH thiet ke landing page ca nhan chuyen sau —
              Bien nang luc thuc su cua ban thanh thoi nam cham thu hut khach hang cao cap va khang dinh vi the doc ton.
            </p>
            <div className="hero-actions">
              <RippleBtn href="#contact" className="btn-hero-primary">
                Phan Tich Thuong Hieu Mien Phi (Tri gia 2Tr) <span className="btn-arrow">→</span>
              </RippleBtn>
              <a href="#benefits" className="btn-hero-ghost">Xem Cach Chung Toi Dot Pha Doanh Thu</a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><strong><Counter target="50" suffix="+" /></strong><span>Chuyen gia tin dung</span></div>
              <div className="stat-divider" />
              <div className="hero-stat"><strong><Counter target="98" suffix="%" /></strong><span>Tang ty le chot sale</span></div>
              <div className="stat-divider" />
              <div className="hero-stat"><strong>&lt;2s</strong><span>Toc do tai trang</span></div>
              <div className="stat-divider" />
              <div className="hero-stat"><strong>24/7</strong><span>Dong hanh ho tro</span></div>
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
          <div className="section-label">Tai Sao Bat Buoc Phai Co Landing Page Ca Nhan?</div>
          <h2 className="section-title">6 Ly Do Website Ca Nhan Se Thay Doi Hoan Toan<br /><span className="gradient-text">Cach Ban Kiem Tien</span></h2>
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
            <p>🏆 <strong>Nhan hieu manh = Khach hang VIP = Thu nhap dot pha. Bat dau ngay hom nay!</strong></p>
            <RippleBtn href="#contact" className="btn-primary">Bat Dau Xay Dung Ngay →</RippleBtn>
          </div>
        </div>
      </Section>

      {/* FEATURES */}
      <Section id="features" className="features-section">
        <div className="container">
          <div className="section-label">Tieu Chuan GIAPTECH</div>
          <h2 className="section-title">Khong Chi La Web Dep,<br /><span className="gradient-text">Chung Toi Xay Dung "Co May In Tien"</span></h2>
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
          <div className="section-label">Quy trinh lam viec</div>
          <h2 className="section-title">Thuc Thi Toc Do —<br /><span className="gradient-text">Minh Bach Tung Buoc</span></h2>
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
          <div className="section-label">Dich Vu Nay Danh Rieng Cho Ai?</div>
          <h2 className="section-title">Chung Toi La "Vu Khi Bi Mat" Cua<br /><span className="gradient-text">Nhung Chuyen Gia Dung Dau Nganh</span></h2>
          <div className="services-grid">
            {services.map((s, i) => (
              <TiltCard key={i} className="service-card" style={{ '--delay': `${i * 0.08}s` }}>
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <a href="#contact" className="service-link">Tu van cho toi →</a>
              </TiltCard>
            ))}
          </div>
        </div>
      </Section>

      {/* PRICING */}
      <Section id="pricing" className="pricing-section">
        <div className="container">
          <div className="section-label">Dau Tu Nho, Vi The Lon</div>
          <h2 className="section-title">Bang Gia Minh Bach —<br /><span className="gradient-text">Tuong Xung Voi Tam Voc Cua Ban</span></h2>
          <p className="pricing-note">Dung dot tien rai to roi hay chay Ads vo dinh. So huu "Mat bang so" vinh vien chi bang chi phi mot chau nhau.</p>
          <div className="pricing-grid">
            {packages.map((pkg, i) => (
              <div className={`pricing-card ${pkg.featured ? 'featured' : ''}`} key={i} style={{ '--delay': `${i * 0.1}s` }}>
                {pkg.featured && <div className="featured-badge">⭐ {pkg.badge || 'Pho bien nhat'}</div>}
                <div className="pkg-header">
                  <h3>{pkg.name}</h3>
                  <p className="pkg-desc">{pkg.desc}</p>
                </div>
                <div className="pkg-price">
                  <span className="price">{pkg.price}</span>
                  <span className="price-note">Ban giao {pkg.time}</span>
                </div>
                <ul className="pkg-features">
                  {pkg.features.map((f, j) => <li key={j} className="ok">✓ {f}</li>)}
                  {pkg.missing.map((f, j) => <li key={j} className="no">✕ {f}</li>)}
                </ul>
                <RippleBtn href="#contact" className={pkg.featured ? 'btn-primary' : 'btn-outline'}>
                  Tu van goi nay →
                </RippleBtn>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact" className="contact-section">
        <div className="container">
          <div className="section-label">Bat Dau Ky Nguyen Moi Cho Thuong Hieu</div>
          <h2 className="section-title">Nhan Lo Trinh Xay Dung Nhan Hieu<br /><span className="gradient-text">Hoan Toan Mien Phi</span></h2>
          <p className="contact-desc">Danh 15 phut noi chuyen voi chuyen gia cua GIAPTECH. Du co hop tac hay khong, ban cung se biet chinh xac minh can lam gi tiep theo de but pha thu nhap.</p>
          <div className="contact-grid">
            <div className="contact-left">
              <h3>Lien he ngay</h3>
              <a href="tel:0352425290" className="contact-method">
                <div className="method-icon">📞</div>
                <div><strong>Goi dien truc tiep</strong><span>0352 425 290</span></div>
                <div className="method-arrow">→</div>
              </a>
              <a href="https://zalo.me/0352425290" target="_blank" rel="noreferrer" className="contact-method">
                <div className="method-icon">💬</div>
                <div><strong>Chat Zalo ngay</strong><span>0352 425 290</span></div>
                <div className="method-arrow">→</div>
              </a>
              <div className="response-time">
                <span>⏰</span>
                <p>Phan hoi toc do trong <strong>30 phut</strong> — Hoat dong 8:00 den 22:00 moi ngay</p>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              {sent ? (
                <div className="form-success">
                  <div className="success-icon">🎉</div>
                  <h3>Da nhan thong tin cua ban!</h3>
                  <p>Chuyen gia GIAPTECH se lien he lai trong vong 30 phut.</p>
                </div>
              ) : (
                <>
                  <h3>De lai thong tin</h3>
                  <div className="form-group">
                    <input type="text" placeholder="Ho va ten chuyen gia" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <input type="tel" placeholder="So dien thoai / Zalo" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <select value={form.job} onChange={e => setForm({...form, job: e.target.value})} required>
                      <option value="">Linh vuc chuyen mon</option>
                      <option>Huan luyen vien PT / Yoga</option>
                      <option>Giao vien / Chuyen gia Dao tao</option>
                      <option>Moi gioi Bat dong san</option>
                      <option>Moi gioi Xe o to</option>
                      <option>Chuyen vien Tai chinh / Bao hiem</option>
                      <option>Chuyen gia Tham my / Spa</option>
                      <option>Linh vuc khac</option>
                    </select>
                  </div>
                  <RippleBtn type="submit" className="btn-primary btn-full">
                    Dang ky nhan lo trinh mien phi 🚀
                  </RippleBtn>
                  <p className="form-privacy">🔒 Thong tin duoc bao mat tuyet doi</p>
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
            <div className="footer-logo">⚡ GIAPTECH</div>
            <p>Be phong thuong hieu ca nhan so 1 cho chuyen gia Viet</p>
          </div>
          <div className="footer-contact">
            <p>📞 0352 425 290</p>
            <p>💬 Zalo: 0352 425 290</p>
            <p>🌐 giaptech.site</p>
          </div>
        </div>
        <div className="footer-bottom">© 2026 GIAPTECH. All rights reserved.</div>
      </footer>

      <button className={`scroll-top ${showTop ? 'show' : ''}`} onClick={scrollTop} aria-label="Len dau trang">↑</button>
    </div>
  )
}
