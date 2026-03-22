import { useState, useEffect, useRef } from 'react'
import './App.css'

// ── Intersection Observer hook
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

// ── Counter animation
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

// ── Animated section
function Section({ children, className = '', id = '' }) {
  const [ref, inView] = useInView()
  return (
    <section ref={ref} id={id} className={`section ${className} ${inView ? 'visible' : ''}`}>
      {children}
    </section>
  )
}

// ── Tilt card
function TiltCard({ children, className = '' }) {
  const cardRef = useRef(null)
  const handleMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`
  }
  const handleLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = ''
  }
  return (
    <div ref={cardRef} className={className} onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{ transition: 'transform 0.15s ease' }}>
      {children}
    </div>
  )
}

// ── Ripple button
function RippleBtn({ children, className = '', href, onClick }) {
  const handleClick = (e) => {
    const btn = e.currentTarget
    const circle = document.createElement('span')
    const diameter = Math.max(btn.clientWidth, btn.clientHeight)
    const radius = diameter / 2
    const rect = btn.getBoundingClientRect()
    circle.style.cssText = `width:${diameter}px;height:${diameter}px;left:${e.clientX - rect.left - radius}px;top:${e.clientY - rect.top - radius}px`
    circle.classList.add('ripple')
    btn.querySelector('.ripple')?.remove()
    btn.appendChild(circle)
    if (onClick) onClick(e)
  }
  if (href) return <a href={href} className={className} onClick={handleClick}>{children}</a>
  return <button className={className} onClick={handleClick}>{children}</button>
}

const benefits = [
  { icon: '🌐', title: 'Hiện diện online 24/7', desc: 'Website hoạt động không nghỉ — khách hàng tìm thấy bạn lúc 2 giờ sáng, cuối tuần, ngày lễ.' },
  { icon: '💎', title: 'Định vị thương hiệu cao cấp', desc: 'Trang web chuyên nghiệp giúp bạn thoát khỏi cuộc chiến giá rẻ — khách hàng sẵn sàng trả nhiều hơn.' },
  { icon: '📈', title: 'Thu leads tự động', desc: 'Form liên hệ, Zalo tích hợp — khách hàng tiềm năng điền thông tin mà bạn không cần làm gì.' },
  { icon: '🎯', title: 'Nhắm đúng khách hàng mục tiêu', desc: 'SEO địa phương + nội dung ngách giúp người thực sự cần dịch vụ của bạn tìm đến, không phải người lướt.' },
  { icon: '🤝', title: 'Xây dựng niềm tin trước khi gặp', desc: 'Portfolio, testimonial, chứng chỉ — khách hàng đã tin tưởng bạn trước khi nhấc điện thoại lên gọi.' },
  { icon: '🚀', title: 'Vượt trội hơn 90% đối thủ', desc: 'Thực tế: 9/10 chuyên gia trong ngành của bạn chưa có landing page chuẩn. Đây là lợi thế không thể bỏ qua.' },
]

const features = [
  { icon: '⚡', title: 'Tốc độ dưới 2 giây', desc: 'Tải nhanh trên mọi thiết bị. Google ưu tiên — khách hàng không bỏ đi.' },
  { icon: '📱', title: 'Mobile-first', desc: '80% khách hàng dùng điện thoại. Chúng tôi thiết kế cho họ trước tiên.' },
  { icon: '🎯', title: 'Tối ưu chuyển đổi', desc: 'Copywriting, màu sắc, CTA — mọi chi tiết được tính toán để tăng tỷ lệ liên hệ.' },
  { icon: '🔍', title: 'Chuẩn SEO', desc: 'Cấu trúc đúng chuẩn, meta tags đầy đủ — Google tìm thấy bạn, đối thủ không thể copy.' },
  { icon: '🛡️', title: 'Ổn định 99.9%', desc: 'Hạ tầng CDN toàn cầu — không bao giờ bị down, bảo mật chuẩn cao cấp.' },
]

const services = [
  { icon: '🏋️', title: 'Huấn luyện viên PT / Yoga', desc: 'Chứng chỉ, lịch tập, testimonial học viên — tất cả trên một trang duy nhất.' },
  { icon: '👨‍🏫', title: 'Giáo viên / Gia sư', desc: 'Phương pháp giảng dạy, thành tích, lịch học — phụ huynh tin tưởng ngay lần đầu.' },
  { icon: '🏠', title: 'Môi giới Bất động sản', desc: 'Portfolio dự án, review khách hàng, form tư vấn — uy tín được xây dựng trước khi gặp mặt.' },
  { icon: '🚗', title: 'Môi giới Xe ô tô', desc: 'Showroom cá nhân online, báo giá tức thì — khách tìm đến bạn trước đối thủ.' },
  { icon: '💰', title: 'Tư vấn Tài chính / Bảo hiểm', desc: 'Nội dung chuyên sâu, case study thực tế — biến sự tin tưởng thành hợp đồng.' },
  { icon: '💆', title: 'Chuyên gia Sắc đẹp / Spa', desc: 'Hình ảnh before/after, đặt lịch online — khách hàng quay lại không cần nhắc.' },
]

const steps = [
  { num: '01', icon: '📋', title: 'Tư vấn & Thu thập thông tin', desc: '15 phút — chúng tôi lắng nghe ngành nghề, mục tiêu và phong cách thương hiệu của bạn.' },
  { num: '02', icon: '🎨', title: 'Lên concept & Thiết kế', desc: 'Đề xuất cấu trúc trang, màu sắc, nội dung phù hợp với ngành. Bạn xem và góp ý trước khi làm.' },
  { num: '03', icon: '💻', title: 'Phát triển & Preview', desc: 'Đội ngũ phát triển trang web. Bạn được xem bản preview thực tế trước khi hoàn thiện.' },
  { num: '04', icon: '✅', title: 'Chỉnh sửa theo yêu cầu', desc: 'Tối đa 3 lần chỉnh sửa miễn phí — đảm bảo bạn 100% hài lòng trước khi bàn giao.' },
  { num: '05', icon: '🚀', title: 'Bàn giao & Go Live', desc: 'Tên miền, hosting, hướng dẫn sử dụng — website của bạn chính thức hoạt động.' },
]

const packages = [
  {
    name: 'Khởi nghiệp',
    price: '2.900.000đ',
    time: '7 ngày',
    desc: 'Phù hợp khi bạn mới bắt đầu xây dựng thương hiệu cá nhân online.',
    features: ['Landing page 1 trang', 'Responsive mobile', 'Form liên hệ', 'SEO cơ bản', 'Bàn giao 7 ngày'],
    missing: ['Tên miền riêng', 'Chỉnh sửa sau bàn giao'],
  },
  {
    name: 'Chuyên nghiệp',
    price: '5.900.000đ',
    time: '14 ngày',
    featured: true,
    desc: 'Giải pháp hoàn chỉnh cho chuyên gia muốn dẫn đầu trong ngành.',
    features: ['Landing page cao cấp', 'Responsive + Animation', 'Form liên hệ & Zalo', 'SEO nâng cao', 'Tên miền .com 1 năm', 'Bàn giao 14 ngày', '3 lần chỉnh sửa miễn phí'],
    missing: [],
  },
  {
    name: 'Thương hiệu',
    price: '9.900.000đ',
    time: '21 ngày',
    desc: 'Dành cho chuyên gia muốn xây dựng hệ sinh thái thương hiệu bền vững.',
    features: ['Landing page premium', 'Animation & Micro-interactions', 'Form + CRM cơ bản', 'SEO chuyên sâu + Blog', 'Tên miền + Hosting 1 năm', 'Bàn giao 21 ngày', 'Hỗ trợ 6 tháng'],
    missing: [],
  },
]

// ── Particle background
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
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.4 + 0.1,
      })
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59,130,246,${p.alpha})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="particles" />
}

<<<<<<< Updated upstream
=======
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

const demos = [
  { id: 1, title: 'Landing Page HLV Fitness Cao Cấp', category: 'PT / Yoga', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80', link: '#' },
  { id: 2, title: 'Thương Hiệu Cá Nhân Yoga & Wellness', category: 'PT / Yoga', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80', link: '#' },
  { id: 3, title: 'Dự Án BĐS VinHomes Premium', category: 'Bất động sản', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80', link: '#' },
  { id: 4, title: 'Môi Giới Nhà Đất Cao Cấp Phú Mỹ Hưng', category: 'Bất động sản', image: 'https://images.unsplash.com/photo-1582407947304-fd86f28f3e34?w=600&q=80', link: '#' },
  { id: 5, title: 'Trung Tâm Luyện Thi Đại Học Chuyên Sâu', category: 'Giáo dục', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80', link: '#' },
  { id: 6, title: 'Chuyên Gia Đào Tạo Kỹ Năng Mềm', category: 'Giáo dục', image: 'https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?w=600&q=80', link: '#' },
  { id: 7, title: 'Showroom Xe Mercedes-Benz Cá Nhân', category: 'Môi giới xe', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80', link: '#' },
  { id: 8, title: 'Chuyên Gia Tư Vấn Xe Toyota & Lexus', category: 'Môi giới xe', image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&q=80', link: '#' },
  { id: 9, title: 'Spa Cao Cấp & Làm Đẹp Toàn Diện', category: 'Spa / Làm đẹp', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80', link: '#' },
  { id: 10, title: 'Chuyên Gia Thẩm Mỹ & Chăm Sóc Da', category: 'Spa / Làm đẹp', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', link: '#' },
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

>>>>>>> Stashed changes
export default function App() {
  const [form, setForm] = useState({ name: '', phone: '', job: '' })
  const [sent, setSent] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('Tất cả')
  const categories = ['Tất cả', 'PT / Yoga', 'Bất động sản', 'Giáo dục', 'Môi giới xe', 'Spa / Làm đẹp']
  const filteredDemos = activeFilter === 'Tất cả' ? demos : demos.filter(d => d.category === activeFilter)

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
<<<<<<< Updated upstream
          {['benefits', 'features', 'process', 'services', 'pricing'].map((id, i) => (
            <li key={id}><a href={`#${id}`} onClick={() => setMenuOpen(false)}>
              {['Lợi ích', 'Cam kết', 'Quy trình', 'Đối tượng', 'Bảng giá'][i]}
=======
          {['benefits','features','process','services','demos','pricing'].map((id,i) => (
            <li key={id}><a href={`#${id}`} onClick={() => setMenuOpen(false)}>
              {['Lợi ích','Tiêu chuẩn','Quy trình','Dành cho ai','Mẫu giao diện','Bảng giá'][i]}
>>>>>>> Stashed changes
            </a></li>
          ))}
        </ul>
        <div className="nav-right">
          <a href="#contact" className="btn-primary nav-cta">Tư vấn miễn phí</a>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <Particles />
        <div className="hero-orb orb1" />
        <div className="hero-orb orb2" />
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot" />
              Chuyên gia xây dựng thương hiệu cá nhân
            </div>
            <h1>
              Bạn giỏi chuyên môn.<br />
              <span className="gradient-text">Đã đến lúc thế giới biết điều đó.</span>
            </h1>
            <p className="hero-desc">
              GIAPTECH tạo landing page cá nhân chuyên nghiệp — giúp bạn thu hút khách hàng tự động,
              xây dựng uy tín vượt trội và tăng thu nhập bền vững.
            </p>
            <div className="hero-actions">
              <RippleBtn href="#contact" className="btn-hero-primary">
                Đặt lịch tư vấn miễn phí <span className="btn-arrow">→</span>
              </RippleBtn>
              <a href="#benefits" className="btn-hero-ghost">Khám phá lợi ích</a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <strong><Counter target="50" suffix="+" /></strong>
                <span>Khách hàng</span>
              </div>
              <div className="stat-divider" />
              <div className="hero-stat">
                <strong><Counter target="98" suffix="%" /></strong>
                <span>Hài lòng</span>
              </div>
              <div className="stat-divider" />
              <div className="hero-stat">
                <strong>&lt;2s</strong>
                <span>Tốc độ tải</span>
              </div>
              <div className="stat-divider" />
              <div className="hero-stat">
                <strong>24/7</strong>
                <span>Hỗ trợ</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="mockup">
              <div className="mockup-bar"><span /><span /><span /></div>
              <div className="mockup-content">
                <div className="mock-nav" />
                <div className="mock-hero">
                  <div className="mock-title" />
                  <div className="mock-sub" />
                  <div className="mock-btn" />
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
          <div className="section-label">Tại sao cần landing page cá nhân?</div>
          <h2 className="section-title">
            6 lợi ích mà website cá nhân<br />
            <span className="gradient-text">mang lại cho sự nghiệp của bạn</span>
          </h2>
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
            <p>🏆 <strong>Thương hiệu cá nhân mạnh = thu nhập cao hơn, khách hàng chủ động hơn, sự nghiệp bền vững hơn.</strong></p>
            <RippleBtn href="#contact" className="btn-primary">Bắt đầu xây dựng ngay →</RippleBtn>
          </div>
        </div>
      </Section>

      {/* FEATURES */}
      <Section id="features" className="features-section">
        <div className="container">
          <div className="section-label">Cam kết của chúng tôi</div>
          <h2 className="section-title">
            Mỗi trang web là một<br />
            <span className="gradient-text">cỗ máy thu hút khách hàng</span>
          </h2>
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
          <h2 className="section-title">
            Từ ý tưởng đến bàn giao —<br />
            <span className="gradient-text">minh bạch từng bước</span>
          </h2>
          <div className="steps">
            {steps.map((s, i) => (
              <div className="step" key={i} style={{ '--delay': `${i * 0.12}s` }}>
                <div className="step-left">
                  <div className="step-num">{s.num}</div>
                  {i < steps.length - 1 && <div className="step-line" />}
                </div>
                <div className="step-card">
                  <div className="step-icon">{s.icon}</div>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* SERVICES */}
      <Section id="services" className="services-section">
        <div className="container">
          <div className="section-label">Ai phù hợp?</div>
          <h2 className="section-title">
            Chúng tôi xây dựng thương hiệu cho<br />
            <span className="gradient-text">những người muốn dẫn đầu ngành của họ</span>
          </h2>
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

<<<<<<< Updated upstream
=======

      {/* DEMOS */}
      <Section id="demos" className="demos-section">
        <div className="container">
          <div className="section-label">Trải Nghiệm Các Dự Án Đã Triển Khai</div>
          <h2 className="section-title">Kho Giao Diện Thực Tế —<br /><span className="gradient-text">Cảm Hứng Cho Thương Hiệu Của Bạn</span></h2>
          <div className="demo-filter">
            {categories.map(cat => (
              <button key={cat} className={`filter-btn ${activeFilter === cat ? 'active' : ''}`} onClick={() => setActiveFilter(cat)}>
                {cat}
              </button>
            ))}
          </div>
          <div className="demo-grid">
            {filteredDemos.map(demo => (
              <TiltCard key={demo.id} className="demo-card">
                <div className="demo-img-wrap">
                  <img src={demo.image} alt={demo.title} loading="lazy" />
                  <div className="demo-overlay">
                    <RippleBtn href={demo.link} className="btn-primary">Xem thực tế →</RippleBtn>
                  </div>
                </div>
                <div className="demo-content">
                  <span className="demo-category">{demo.category}</span>
                  <div className="demo-title">{demo.title}</div>
                </div>
              </TiltCard>
            ))}
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

>>>>>>> Stashed changes
      {/* PRICING */}
      <Section id="pricing" className="pricing-section">
        <div className="container">
          <div className="section-label">Đầu tư một lần, sinh lời mãi mãi</div>
          <h2 className="section-title">
            Gói dịch vụ <span className="gradient-text">minh bạch, không phát sinh</span>
          </h2>
          <p className="pricing-note">Chi phí chạy quảng cáo 1 tháng có thể mua được một landing page dùng mãi mãi.</p>
          <div className="pricing-grid">
            {packages.map((pkg, i) => (
              <div className={`pricing-card ${pkg.featured ? 'featured' : ''}`} key={i} style={{ '--delay': `${i * 0.1}s` }}>
                {pkg.featured && <div className="featured-badge">⭐ Phổ biến nhất</div>}
                <div className="pkg-header">
                  <h3>{pkg.name}</h3>
                  <p className="pkg-desc">{pkg.desc}</p>
                </div>
                <div className="pkg-price">
                  <span className="price">{pkg.price}</span>
                  <span className="price-note">Bàn giao {pkg.time}</span>
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
          <div className="section-label">Bắt đầu hành trình của bạn</div>
          <h2 className="section-title">
            Tư vấn <span className="gradient-text">miễn phí 100%</span>
          </h2>
          <p className="contact-desc">15 phút — chúng tôi sẽ phác thảo ngay landing page phù hợp cho bạn, không ép mua.</p>
          <div className="contact-grid">
            <div className="contact-left">
              <h3>Liên hệ ngay</h3>
              <a href="tel:0352425290" className="contact-method">
                <div className="method-icon">📞</div>
                <div><strong>Gọi điện tư vấn</strong><span>0352 425 290</span></div>
                <div className="method-arrow">→</div>
              </a>
              <a href="https://zalo.me/0352425290" target="_blank" rel="noreferrer" className="contact-method">
                <div className="method-icon">💬</div>
                <div><strong>Nhắn Zalo</strong><span>0352 425 290</span></div>
                <div className="method-arrow">→</div>
              </a>
              <div className="response-time">
                <span>⏰</span>
                <p>Phản hồi trong <strong>30 phút</strong> — từ 8:00 đến 22:00 mỗi ngày</p>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              {sent ? (
                <div className="form-success">
                  <div className="success-icon">🎉</div>
                  <h3>Đã nhận thông tin của bạn!</h3>
                  <p>Chúng tôi sẽ liên hệ lại trong vòng 30 phút.</p>
                </div>
              ) : (
                <>
                  <h3>Để lại thông tin</h3>
                  <div className="form-group">
                    <input type="text" placeholder="Họ và tên" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <input type="tel" placeholder="Số điện thoại / Zalo" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <select value={form.job} onChange={e => setForm({...form, job: e.target.value})} required>
                      <option value="">Nghề nghiệp của bạn</option>
                      <option>Huấn luyện viên PT / Yoga</option>
                      <option>Giáo viên / Gia sư</option>
                      <option>Môi giới Bất động sản</option>
                      <option>Môi giới Xe ô tô</option>
                      <option>Tư vấn Tài chính / Bảo hiểm</option>
                      <option>Chuyên gia Sắc đẹp / Spa</option>
                      <option>Khác</option>
                    </select>
                  </div>
                  <RippleBtn className="btn-primary btn-full" onClick={null}>
                    Đăng ký tư vấn miễn phí 🚀
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
            <p>Chuyên gia xây dựng thương hiệu cá nhân cho người Việt</p>
          </div>
          <div className="footer-contact">
            <p>📞 0352 425 290</p>
            <p>💬 Zalo: 0352 425 290</p>
            <p>🌐 giaptech.site</p>
          </div>
        </div>
        <div className="footer-bottom">© 2026 GIAPTECH. All rights reserved.</div>
      </footer>

      {/* SCROLL TOP */}
      <button className={`scroll-top ${showTop ? 'show' : ''}`} onClick={scrollTop} aria-label="Len dau trang">↑</button>
    </div>
  )
}
