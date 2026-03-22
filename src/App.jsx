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
  { icon: '🌐', title: '"Cỗ Máy Sale" Không Biết Mệt', desc: 'Khách hàng âm thầm tìm hiểu bạn lúc nửa đêm và để lại thông tin khi bạn đang ngủ. Đừng bỏ lỡ bất kỳ cơ hội nào.' },
  { icon: '💎', title: 'Thoát Khỏi "Bẫy Giá Rẻ"', desc: 'Giao diện sang trọng là minh chứng cho đẳng cấp. Khách hàng sẽ không kỳ kèo khi bị thuyết phục bởi sự chuyên nghiệp của bạn.' },
  { icon: '📈', title: 'Tự Động Hóa Dòng Khách Hàng', desc: 'Tích hợp thông minh Form, Zalo. Bạn chỉ việc tư vấn và chốt sale, việc tìm kiếm khách hàng đã có website lo.' },
  { icon: '🎯', title: '"Đánh Xa Khỏi Vùng An Toàn"', desc: 'Tối ưu SEO và nội dung ngách giúp tiếp cận chính xác người đang khao khát dịch vụ của bạn, lọc bỏ khách "hỏi cho biết".' },
  { icon: '🤝', title: 'Chốt Sale Từ Trong Trứng Nước', desc: 'Phô diễn năng lực qua Portfolio, chứng chỉ, Testimonials. Họ gọi cho bạn để mua, chứ không phải để hỏi "bạn là ai".' },
  { icon: '🚀', title: 'Đè Bẹp 90% Đối Thủ Cùng Ngành', desc: 'Bao nhiêu người trong ngành của bạn đang làm được điều này? Đây chính là "Đại dương xanh" để bạn bứt phá.' },
]

const features = [
  { icon: '⚡', title: 'Tốc Độ < 2 Giây (Chuẩn Core Web Vitals)', desc: 'Khách hàng thiếu kiên nhẫn và Google cũng vậy. Chúng tôi đảm bảo trải nghiệm mượt mà, giữ chân khách ở lại trang lâu nhất.' },
  { icon: '📱', title: 'Tối Ưu Hoá Mobile (Mobile-first)', desc: 'Thiết kế được đo ni đóng giày cho màn hình điện thoại, nơi 80% khách hàng của bạn đang lướt web mỗi ngày.' },
  { icon: '🎯', title: 'Nghệ Thuật "Thôi Miên" Khách Hàng', desc: 'Từ ngôn từ sắc bén đến tâm lý học màu sắc, mọi yếu tố đều được sắp đặt có chủ đích để thôi thúc họ hành động ngay.' },
  { icon: '🔍', title: 'Chuẩn Mực SEO Mới Nhất', desc: 'Tối ưu On-page toàn diện, giúp tên tuổi của bạn nhanh chóng thống lĩnh trang nhất Google khi khách hàng tìm kiếm.' },
  { icon: '🛡️', title: 'Hạ Tầng Vững Như Bàn Thạch', desc: 'Không lo sập web lúc chạy quảng cáo hay có lượng truy cập đột biến. Bảo mật tuyệt đối mọi dữ liệu khách hàng.' },
]

const services = [
  { icon: '🏋️', title: 'Personal Trainer / HLV Yoga', desc: 'Biến hình thể đẹp và chứng chỉ thành thỏi nam châm hút học viên. Tự động hóa lịch tập chuyên nghiệp.' },
  { icon: '👨‍🏫', title: 'Giáo Viên / Chuyên Gia Đào Tạo', desc: 'Xây dựng niềm tin tuyệt đối với phụ huynh qua bảng thành tích đáng nể và phương pháp giảng dạy khác biệt.' },
  { icon: '🏠', title: 'Môi Giới Bất Động Sản', desc: 'Khẳng định đẳng cấp "người chơi hệ dự án lớn". Uy tín đi trước, hợp đồng tiền tỷ theo sau.' },
  { icon: '🚗', title: 'Môi Giới Xe Ô Tô', desc: 'Tạo showroom ảo cá nhân cực sang chảnh. Khách hàng xem xe qua web, gọi điện là để chốt cọc.' },
  { icon: '💰', title: 'Chuyên Viên Tài Chính / Bảo Hiểm', desc: 'Đập tan sự hoài nghi của khách hàng. Xây dựng hình ảnh chuyên gia tư vấn đáng tin cậy trọn đời.' },
  { icon: '💆', title: 'Chuyên Gia Thẩm Mỹ / Spa', desc: 'Phô diễn những ca "lột xác" thần thánh. Khách hàng khao khát làm đẹp và tranh nhau đặt lịch trước hàng tuần.' },
]

const steps = [
  { num: '01', icon: '📋', title: 'Khai Thác Điểm Mạnh Nhất Của Bạn', desc: '15 phút lắng nghe để thấu hiểu ngành nghề, lợi thế cạnh tranh và định hình phong cách thương hiệu cá nhân.' },
  { num: '02', icon: '🎨', title: 'Phác Thảo "Vũ Khí" Bán Hàng', desc: 'Đề xuất cấu trúc chiến lược, màu sắc, và luồng nội dung tâm lý học. Bạn sẽ duyệt trước khi chúng tôi code.' },
  { num: '03', icon: '💻', title: 'Lập Trình & Trải Nghiệm Thực Tế', desc: 'Chuyển hóa bản vẽ thành website hoạt động mượt mà. Bạn được trực tiếp trải nghiệm bản preview.' },
  { num: '04', icon: '✅', title: 'Tinh Chỉnh Hoàn Hảo', desc: 'Tối đa 3 lần điều chỉnh miễn phí để đảm bảo từng câu chữ, hình ảnh đều sắc nét và đúng ý bạn 100%.' },
  { num: '05', icon: '🚀', title: 'Kích Hoạt & Thống Lĩnh Thị Trường', desc: 'Bàn giao toàn bộ tên miền, mã nguồn và hướng dẫn tận tình. Cỗ máy thu hút khách hàng của bạn chính thức vận hành.' },
]

const packages = [
  {
    name: 'Khởi nghiệp',
    price: '2.900.000đ',
    time: '7 ngày',
    desc: 'Bệ phóng hoàn hảo khi bạn mới bắt đầu xây dựng thương hiệu cá nhân online.',
    features: ['Landing page 1 trang', 'Tối ưu giao diện Mobile', 'Form liên hệ cơ bản', 'Chuẩn SEO On-page', 'Ban giao toc toc 7 ngày'],
    missing: ['Tên miền riêng', 'Chỉnh sửa sau bàn giao'],
  },
  {
    name: 'Chuyên nghiệp',
    price: '5.900.000đ',
    time: '14 ngày',
    featured: true,
    badge: 'GIẢI PHÁP TỐI ƯU NHẤT',
    desc: 'Dành cho chuyên gia muốn bứt phá và dẫn đầu thị phần.',
    features: ['Landing page thiết kế cao cấp', 'Hiệu ứng Animation mượt mà', 'Tích hợp Form & Nút gọi/Zalo', 'Tối ưu SEO nâng cao', 'Tặng Tên miền .com 1 năm', 'Ban giao 14 ngày', '3 lần chỉnh sửa miễn phí'],
    missing: [],
  },
  {
    name: 'Thương hiệu',
    price: '9.900.000đ',
    time: '21 ngày',
    desc: 'Dành cho chuyên gia VIP muốn xây dựng hệ sinh thái thương hiệu bền vững, độc quyền.',
    features: ['Thiết kế Premium độc bản', 'Micro-interactions đỉnh cao', 'Form + Tích hợp Mini CRM', 'SEO chuyên sâu + Mục Blog', 'Tặng Tên miền + Hosting 1 năm', 'Ban giao 21 ngày', 'Bảo hành & Hỗ trợ 6 tháng'],
    missing: [],
  },
]




const premiumDemos = [
  {
    id: 1,
    title: 'Xtreme Fitness — HLV Cá Nhân Đẳng Cấp',
    category: 'PT / Yoga',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=85',
    link: 'https://html.designingmedia.com/xtreme-fitness/?storefront=envato-elements',
  },
  {
    id: 2,
    title: 'FiTrainer — Chuyên Gia Huấn Luyện Cá Nhân',
    category: 'PT / Yoga',
    tag: 'Exclusive',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=85',
    link: 'https://htmldesigntemplates.com/html/fitrainer/?storefront=envato-elements',
  },
  {
    id: 3,
    title: 'Zoyot — Studio Yoga & Wellness Cao Cấp',
    category: 'PT / Yoga',
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=85',
    link: 'https://themesflat.co/html/zoyot/?storefront=envato-elements',
  },
  {
    id: 4,
    title: 'BodyShape Pro — Gym & Fitness Đỉnh Cao',
    category: 'PT / Yoga',
    tag: 'Elite',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=85',
    link: 'https://bodyshape.dexignzone.com/xhtml/index-2.html',
  },
  {
    id: 5,
    title: 'BodyShape Dark — Phòng Gym Premium',
    category: 'PT / Yoga',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=85',
    link: 'https://bodyshape.dexignzone.com/xhtml/index-3.html',
  },
  {
    id: 6,
    title: 'BodyShape Classic — Thương Hiệu Gym Bền Vững',
    category: 'PT / Yoga',
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=85',
    link: 'https://bodyshape.dexignzone.com/xhtml/index.html',
  },
  {
    id: 7,
    title: 'GymOn Dark — HLV & Trung Tâm Gym Hạng Sâng',
    category: 'PT / Yoga',
    tag: 'Elite',
    image: 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=800&q=85',
    link: 'https://winsfolio.net/html/gymon/gym-on-drak/index.html',
  },
  {
    id: 8,
    title: 'Hamilton Realty — Môi Giới BĐS Luxury',
    category: 'Bất động sản',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=85',
    link: 'https://devsaidul.com/tm/html/hamilton/?storefront=envato-elements',
  },
  {
    id: 9,
    title: 'Relx Tower — Dự Án Căn Hộ Hạng A',
    category: 'Bất động sản',
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=85',
    link: 'https://htmldemo.zcubethemes.com/relxtower/?storefront=envato-elements',
  },
  {
    id: 10,
    title: 'Quarter Modern — BĐS Hiện Đại',
    category: 'Bất động sản',
    tag: 'Elite',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=85',
    link: 'https://html.themewin.com/pixells/quarter-tailwind-preview/quarter/index-2.html',
  },
  {
    id: 11,
    title: 'Quarter Dark — Sống Đẳng Cấp',
    category: 'Bất động sản',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=85',
    link: 'https://html.themewin.com/pixells/quarter-tailwind-preview/quarter/index-3.html',
  },
  {
    id: 12,
    title: 'Quarter Prestige — Biệt Thự & Penthouse',
    category: 'Bất động sản',
    tag: 'Exclusive',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=85',
    link: 'https://html.themewin.com/pixells/quarter-tailwind-preview/quarter/index-4.html',
  },
  {
    id: 13,
    title: 'Quarter Classic — Uy Tín Hàng Đầu',
    category: 'Bất động sản',
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=85',
    link: 'https://html.themewin.com/pixells/quarter-tailwind-preview/quarter/index.html',
  },
  {
    id: 14,
    title: 'HomPark — Khu Đô Thị Đẳng Cấp',
    category: 'Bất động sản',
    tag: 'Elite',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=85',
    link: 'https://themezinho.net/hompark/?storefront=envato-elements',
  },
  {
    id: 15,
    title: 'HouseBox — Nền Tảng BĐS Thông Minh',
    category: 'Bất động sản',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=85',
    link: 'https://housebox-html-demo.vercel.app/?storefront=envato-elements',
  },
  {
    id: 16,
    title: 'Cardinal — Trung Tâm Rửa Xe & Sửa Chữa',
    category: 'Ô tô',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=85',
    link: 'https://demoxml.com/html/cardinal/?storefront=envato-elements',
  },
  {
    id: 17,
    title: 'Auril — Xưởng Cơ Động Cơ Hạng Sang',
    category: 'Ô tô',
    tag: 'Elite',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=85',
    link: 'https://demoxml.com/html/auril/?storefront=envato-elements',
  },
  {
    id: 18,
    title: 'CarBook Classic — Showroom & Đặt Lịch Dịch Vụ',
    category: 'Ô tô',
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=85',
    link: 'https://winsfolio.net/html/carbook/demo-1/index.html',
  },
  {
    id: 19,
    title: 'CarBook Pro — Garage & Chăm Sóc Xe Cao Cấp',
    category: 'Ô tô',
    tag: 'Exclusive',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=85',
    link: 'https://winsfolio.net/html/carbook/demo-2/index.html',
  },
  {
    id: 20,
    title: 'Finance Pro — Tư Vấn Tài Chính Cao Cấp',
    category: 'Tài chính',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=85',
    link: 'https://themesflat.co/html/finance/?storefront=envato-elements',
  },
  {
    id: 21,
    title: 'Finano Dark — Chuyên Gia Đầu Tư Chứng Khoán',
    category: 'Tài chính',
    tag: 'Elite',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=85',
    link: 'https://html.themexriver.com/finano/index-2.html',
  },
  {
    id: 22,
    title: 'Finano Business — Hoạch Định Tài Chính Doanh Nghiệp',
    category: 'Tài chính',
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=85',
    link: 'https://html.themexriver.com/finano/index-3.html',
  },
  {
    id: 23,
    title: 'Finano Wealth — Quản Lý Tài Sản Hạng Sang',
    category: 'Tài chính',
    tag: 'Exclusive',
    image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&q=85',
    link: 'https://html.themexriver.com/finano/index-4.html',
  },
  {
    id: 24,
    title: 'Finano Capital — Quỹ Đầu Tư & Bảo Hiểm',
    category: 'Tài chính',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=85',
    link: 'https://html.themexriver.com/finano/index-5.html',
  },
  {
    id: 25,
    title: 'Finano Classic — Cố Vấn Tài Chính Uy Tín',
    category: 'Tài chính',
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=85',
    link: 'https://html.themexriver.com/finano/index.html',
  },
  {
    id: 26,
    title: 'Luxe Spa — Thư Giãn & Chăm Sóc Toàn Diện',
    category: 'Spa / Thẩm mỹ',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&q=85',
    link: 'https://thewebmax.org/spa/index-2.html',
  },
  {
    id: 27,
    title: 'Serenity Spa — Liệu Pháp Đẳng Cấp 5 Sao',
    category: 'Spa / Thẩm mỹ',
    tag: 'Elite',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=85',
    link: 'https://thewebmax.org/spa/index-3.html',
  },
  {
    id: 28,
    title: 'Glow Studio — Thẩm Mỹ Viện Hạng A',
    category: 'Spa / Thẩm mỹ',
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=85',
    link: 'https://thewebmax.org/spa/index-4.html',
  },
  {
    id: 29,
    title: 'Belle Clinic — Chăm Sóc Da & Làm Đẹp Chuyên Sâu',
    category: 'Spa / Thẩm mỹ',
    tag: 'Exclusive',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=85',
    link: 'https://thewebmax.org/spa/index-5.html',
  },
  {
    id: 30,
    title: 'Zen Spa Classic — Massage & Năng Lượng Tâm Hồn',
    category: 'Spa / Thẩm mỹ',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=85',
    link: 'https://thewebmax.org/spa/index.html',
  },
  {
    id: 31,
    title: 'Examin Academy — Nền Tảng Học Online Hàng Đầu',
    category: 'Giáo dục',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=85',
    link: 'https://validthemes.net/site-template/examin/index-2.html',
  },
  {
    id: 32,
    title: 'Examin Pro — Trung Tâm Luyện Thi Đạt Đỉnh',
    category: 'Giáo dục',
    tag: 'Elite',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=85',
    link: 'https://validthemes.net/site-template/examin/index-3.html',
  },
  {
    id: 33,
    title: 'Examin University — Đại Học & Sau Đại Học',
    category: 'Giáo dục',
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=85',
    link: 'https://validthemes.net/site-template/examin/index-4.html',
  },
  {
    id: 34,
    title: 'Examin Kids — Giáo Dục Thiếu Nhi Chất Lượng Cao',
    category: 'Giáo dục',
    tag: 'Exclusive',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=85',
    link: 'https://validthemes.net/site-template/examin/index-5.html',
  },
  {
    id: 35,
    title: 'Examin Skills — Đào Tạo Kỹ Năng Nghề Nghiệp',
    category: 'Giáo dục',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=85',
    link: 'https://validthemes.net/site-template/examin/index-6.html',
  },
  {
    id: 36,
    title: 'Examin Language — Trung Tâm Ngoại Ngữ Quốc Tế',
    category: 'Giáo dục',
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=85',
    link: 'https://validthemes.net/site-template/examin/index-7.html',
  },
  {
    id: 37,
    title: 'Examin MBA — Đào Tạo Quản Trị & Lãnh Đạo',
    category: 'Giáo dục',
    tag: 'Elite',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=85',
    link: 'https://validthemes.net/site-template/examin/index-8.html',
  },
]

const faqs = [
  {
    q: 'Tôi chưa có hình ảnh cá nhân chuyên nghiệp thì sao?',
    a: 'GIAPTECH sẽ tư vấn concept chụp ảnh phù hợp với ngành nghề của bạn. Trong thời gian bạn chuẩn bị, chúng tôi có thể sử dụng kho ảnh minh họa cao cấp có bản quyền để thiết kế trước cấu trúc và luồng trải nghiệm.'
  },
  {
    q: 'Sau khi bàn giao, tôi có phải đóng thêm phí duy trì không?',
    a: 'Với gói Khởi nghiệp, bạn tự quản lý hosting/tên miền. Với gói Chuyên nghiệp và Thương hiệu, GIAPTECH đã tài trợ năm đầu tiên. Từ năm thứ 2 trở đi, chi phí gia hạn theo giá gốc nhà cung cấp (chỉ khoảng vài trăm nghìn/năm).'
  },
  {
    q: 'Tôi có thể tự thay đổi nội dung, hình ảnh sau này không?',
    a: 'Hoàn toàn được. Sau khi Go-live, chúng tôi bàn giao bộ video hướng dẫn chi tiết cách tự thay chữ, đổi ảnh rất trực quan — bạn không cần biết lập trình vẫn thao tác dễ dàng.'
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
      <div className="faq-question">
        <span>{q}</span>
        <span className="faq-icon">{open ? '−' : '+'}</span>
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
  const [activeTab, setActiveTab] = useState('Tất cả')
  const portfolioTabs = ['Tất cả', 'PT / Yoga', 'Bất động sản', 'Ô tô', 'Tài chính', 'Spa / Thẩm mỹ', 'Giáo dục']
  const visibleDemos = (() => {
    if (activeTab !== 'Tất cả') return premiumDemos.filter(d => d.category === activeTab)
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
          <img src="/logo.png" alt="GIAPTECH" style={{height:'40px',objectFit:'contain'}} />
        </a>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><a href="#" onClick={e => { e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); setMenuOpen(false) }}>Trang chủ</a></li>
          {['benefits','features','process','services','portfolio','pricing'].map((id,i) => (
            <li key={id}><a href="#" onClick={e => { e.preventDefault(); const el=document.getElementById(id); if(el){el.scrollIntoView({behavior:'smooth'})} setMenuOpen(false) }}>
              {['Lợi ích','Tiêu chuẩn','Quy trình','Dành cho ai','Portfolio','Bảng giá'][i]}
            </a></li>
          ))}
        </ul>
        <div className="nav-right">
          <RippleBtn href="#contact" className="btn-primary nav-cta">Tư vấn miễn phí</RippleBtn>
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
            <div className="hero-badge"><span className="badge-dot" />Bệ Phóng Thương Hiệu Cá Nhân Chuyên Nghiệp</div>
            <h1>
              Tôn vinh thực tài —<br />
              <span className="gradient-text">Nâng tầm vị thế</span>
            </h1>
            <p className="hero-desc">
              Khách hàng không thể trực tiếp trải nghiệm chuyên môn của bạn qua màn hình, họ đánh giá qua sự chuyên nghiệp. Đừng tuột mất khách hàng VIP vào tay đối thủ chỉ vì bề ngoài số hóa của họ bóng bẩy hơn.
            </p>
            <div className="hero-actions">
              <RippleBtn href="#contact" className="btn-hero-primary">
                Phân Tích Thương Hiệu Miễn Phí (Trị giá 2Tr) <span className="btn-arrow">→</span>
              </RippleBtn>
              <a href="#benefits" className="btn-hero-ghost">Xem Cách Chúng Tôi Đột Phá Doanh Thu</a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><strong>2.500+</strong><span>Chuyên gia tin dùng</span></div>
              <div className="stat-divider" />
              <div className="hero-stat"><strong>98%</strong><span>Tăng tỷ lệ chốt sale</span></div>
              <div className="stat-divider" />
              <div className="hero-stat"><strong>&lt;2s</strong><span>Tốc độ tải trang</span></div>
              <div className="stat-divider" />
              <div className="hero-stat"><strong>24/7</strong><span>Đồng hành hỗ trợ</span></div>
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
          <div className="section-label">Tại Sao Bắt Buộc Phải Có Landing Page Cá Nhân?</div>
          <h2 className="section-title">6 Lý Do Website Cá Nhân Sẽ Thay Đổi Hoàn Toàn<br /><span className="gradient-text">Cách Bạn Kiếm Tiền</span></h2>
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
            <p>🏆 <strong>Nhân hiệu mạnh = Khách hàng VIP = Thu nhập đột phá. Bắt đầu ngay hôm nay!</strong></p>
            <RippleBtn href="#contact" className="btn-primary">Bắt Đầu Xây Dựng Ngay →</RippleBtn>
          </div>
        </div>
      </Section>

      {/* FEATURES */}
      <Section id="features" className="features-section">
        <div className="container">
          <div className="section-label">Tiêu Chuẩn GIAPTECH</div>
          <h2 className="section-title">Không Chỉ Là Web Đẹp,<br /><span className="gradient-text">Chúng Tôi Xây Dựng "Cỗ Máy In Tiền"</span></h2>
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
          <div className="section-label">Quy trình làm việc</div>
          <h2 className="section-title">Thực Thi Tốc Độ —<br /><span className="gradient-text">Minh Bạch Từng Bước</span></h2>
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
          <div className="section-label">Dịch Vụ Này Dành Riêng Cho Ai?</div>
          <h2 className="section-title">Chúng Tôi Là "Vũ Khí Bí Mật" Của<br /><span className="gradient-text">Những Chuyên Gia Đứng Đầu Ngành</span></h2>
          <div className="services-grid">
            {services.map((s, i) => (
              <TiltCard key={i} className="service-card" style={{ '--delay': `${i * 0.08}s` }}>
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <a href="#contact" className="service-link">Tư vấn cho tôi →</a>
              </TiltCard>
            ))}
          </div>
        </div>
      </Section>





      {/* PORTFOLIO */}
      <Section id="portfolio" className="portfolio-section">
        <div className="container">
          <div className="portfolio-header">
            <div className="section-label">Kho Giao Diện Độc Bản</div>
            <h2 className="section-title">Mỗi Dự Án Là Một<br /><span className="gradient-text">Tác Phẩm Đẳng Cấp</span></h2>
            <p className="portfolio-sub">Không có template. Không có bản sậy. Mỗi website được thai nghén riêng cho từng chuyên gia.</p>
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
                      Xem Bản Live →
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
            <p>Đây chỉ là một phần nhỏ trong portfolio của chúng tôi.</p>
            <RippleBtn href="#contact" className="btn-primary">Nhận Tư Vấn Để Xem Toàn Bộ →</RippleBtn>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="faq-section">
        <div className="container">
          <div className="section-label">Giải Đáp Thắc Mắc</div>
          <h2 className="section-title">Những Câu Hỏi Thường Gặp Trước Khi<br /><span className="gradient-text">Khởi Tạo Thương Hiệu</span></h2>
          <div className="faq-list">
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </Section>

      {/* PRICING */}
      <Section id="pricing" className="pricing-section">
        <div className="container">
          <div className="section-label">Đầu Tư Nhỏ, Vị Thế Lớn</div>
          <h2 className="section-title">Bảng Giá Minh Bạch —<br /><span className="gradient-text">Tuong Xung Voi Tam Voc Của Ban</span></h2>
          <p className="pricing-note">Đừng đốt tiền rải tờ rơi hay chạy Ads vô định. Sở hữu "Mặt bằng số" vĩnh viễn chỉ bằng chi phí một chầu nhậu.</p>

          <div className="scarcity-banner">
            <span className="scarcity-fire">🔥</span>
            <p><strong>Lưu ý:</strong> Để đảm bảo chất lượng cá nhân hóa cao nhất, GIAPTECH chỉ nhận tối đa <strong>05 dự án/tháng</strong>.<br /><span className="scarcity-urgent">Cập nhật: Tháng này chỉ còn 02 vị trí trống.</span></p>
          </div>
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
                  Tư vấn gói này →
                </RippleBtn>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact" className="contact-section">
        <div className="container">
          <div className="section-label">Bắt Đầu Kỷ Nguyên Mới Cho Thương Hiệu</div>
          <h2 className="section-title">Nhận Lộ Trình Xây Dựng Nhân Hiệu<br /><span className="gradient-text">Hoàn Toàn Miễn Phí</span></h2>
          <p className="contact-desc">Dành 15 phút nói chuyện với chuyên gia của GIAPTECH. Dù có hợp tác hay không, bạn cũng sẽ biết chính xác mình cần làm gì tiếp theo để bứt phá thu nhập.</p>
          <div className="contact-grid">
            <div className="contact-left">
              <h3>Liên hệ ngay</h3>
              <a href="tel:0352425290" className="contact-method">
                <div className="method-icon">📞</div>
                <div><strong>Gọi điện trực tiếp</strong><span>0352 425 290</span></div>
                <div className="method-arrow">→</div>
              </a>
              <a href="https://zalo.me/0352425290" target="_blank" rel="noreferrer" className="contact-method">
                <div className="method-icon">💬</div>
                <div><strong>Chat Zalo ngay</strong><span>0352 425 290</span></div>
                <div className="method-arrow">→</div>
              </a>
              <a href="https://m.me/583549081512783" target="_blank" rel="noreferrer" className="contact-method">
                <div className="method-icon">💙</div>
                <div><strong>Nhắn tin Messenger</strong><span>GIAPTECH</span></div>
                <div className="method-arrow">→</div>
              </a>
              <div className="response-time">
                <span>⏰</span>
                <p>Phản hồi tốc độ trong <strong>30 phút</strong> — Hoạt động 8:00 đến 22:00 mỗi ngày</p>
              </div>
            </div>
            <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
              {sent ? (
                <div className="form-success">
                  <div className="success-icon">🎉</div>
                  <h3>Đã nhận thông tin của bạn!</h3>
                  <p>Chuyên gia GIAPTECH sẽ liên hệ lại trong vòng 30 phút.</p>
                </div>
              ) : (
                <>
                  <h3>Để lại thông tin</h3>
                  <div className="form-group">
                    <input type="text" placeholder="Nhập tên ..." required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <input type="tel" placeholder="Số điện thoại / Zalo" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <select value={form.job} onChange={e => setForm({...form, job: e.target.value})} required>
                      <option value="">Lĩnh vực chuyên môn</option>
                      <option>Huấn luyện viên PT / Yoga</option>
                      <option>Giáo viên / Chuyên gia Đào tạo</option>
                      <option>Môi giới Bất động sản</option>
                      <option>Môi giới Xe ô tô</option>
                      <option>Chuyên viên Tài chính / Bảo hiểm</option>
                      <option>Chuyên gia Thẩm mỹ / Spa</option>
                      <option>Lĩnh vực khác</option>
                    </select>
                  </div>
                  <RippleBtn type="submit" className="btn-primary btn-full">
                    Đăng ký nhận lộ trình miễn phí 🚀
                  </RippleBtn>
                  <p className="form-privacy">🔒 Thông tin được bảo mật tuyệt đối</p>
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
            <p>Bệ phóng thương hiệu cá nhân số 1 cho chuyên gia Việt</p>
          </div>
          <div className="footer-contact">
            <p>📞 0352 425 290</p>
            <p>💬 Zalo: 0352 425 290</p>
            <p>🌐 giaptech.site</p>
          </div>
        </div>
        <div className="footer-bottom">© 2026 GIAPTECH. All rights reserved.</div>
      </footer>


      {/* MOBILE ACTION BAR */}
      <div className="mobile-action-bar">
        <a href="#" onClick={e => { e.preventDefault(); const el = document.getElementById('contact-form'); if(el){ el.scrollIntoView({behavior:'smooth', block:'center'}) } }} className="mob-btn mob-btn-outline">
          <span>📝</span> Gửi Thông Tin
        </a>
        <a href="https://zalo.me/0352425290" target="_blank" rel="noreferrer" className="mob-btn mob-btn-primary">
          <span>💬</span> Chat Zalo
        </a>
      </div>

      <button className={`scroll-top ${showTop ? 'show' : ''}`} onClick={scrollTop} aria-label="Lên đầu trang">↑</button>
      <a href="https://m.me/583549081512783" target="_blank" rel="noreferrer" className="messenger-bubble" aria-label="Chat Messenger">
        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.906 1.404 5.497 3.6 7.22V22l3.25-1.786A10.5 10.5 0 0012 20.486c5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.07 12.44l-2.55-2.72-4.98 2.72 5.48-5.82 2.61 2.72 4.92-2.72-5.48 5.82z"/></svg>
      </a>
    </div>
  )
}
