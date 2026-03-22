import { useState } from 'react'
import './App.css'

const services = [
  { icon: '🏋️', title: 'Huấn luyện viên PT / Yoga', desc: 'Trang cá nhân thể hiện chuyên môn, chứng chỉ, lịch tập và form đăng ký học viên.' },
  { icon: '👨‍🏫', title: 'Giáo viên / Gia sư', desc: 'Giới thiệu phương pháp giảng dạy, thành tích học sinh, lịch học và học phí rõ ràng.' },
  { icon: '🏠', title: 'Môi giới Bất động sản', desc: 'Portfolio dự án đã bán, review khách hàng, form tư vấn — tạo uy tín chốt deal nhanh hơn.' },
  { icon: '🚗', title: 'Môi giới Xe ô tô', desc: 'Showroom online cá nhân, so sánh dòng xe, form báo giá — khách hàng tìm đến bạn trước.' },
  { icon: '💰', title: 'Tư vấn Tài chính / Bảo hiểm', desc: 'Xây dựng sự tin tưởng qua nội dung chuyên sâu, case study thực tế và form tư vấn miễn phí.' },
  { icon: '💆', title: 'Chuyên gia Sắc đẹp / Spa', desc: 'Trước - sau thuyết phục, lịch đặt hẹn online, chính sách rõ ràng — khách quay lại nhiều hơn.' },
]

const pains = [
  { icon: '😰', text: 'Bạn giỏi chuyên môn nhưng khách hàng không biết đến bạn?' },
  { icon: '📱', text: 'Chỉ dùng Facebook cá nhân để kinh doanh — không chuyên nghiệp, dễ bị mất tài khoản?' },
  { icon: '🤦', text: 'Đối thủ kém hơn bạn nhưng lại có nhiều khách hơn chỉ vì họ trông "chuyên nghiệp" hơn?' },
  { icon: '💸', text: 'Đang bỏ tiền chạy quảng cáo nhưng không có trang đích — tiền đổ sông đổ biển?' },
]

const features = [
  { icon: '⚡', title: 'Tốc độ tải dưới 1 giây', desc: 'Công nghệ React + Vite thế hệ mới — nhanh hơn 3x so với website WordPress thông thường. Google ưu tiên xếp hạng cao hơn.' },
  { icon: '📱', title: 'Chuẩn Mobile-first', desc: '80% khách hàng của bạn dùng điện thoại. Chúng tôi thiết kế cho điện thoại trước — đảm bảo trải nghiệm hoàn hảo.' },
  { icon: '🎯', title: 'Tối ưu chuyển đổi', desc: 'Mỗi dòng chữ, nút bấm, màu sắc đều được thiết kế theo tâm lý hành vi người dùng Việt Nam để tối đa hóa leads.' },
  { icon: '🔍', title: 'Chuẩn SEO kỹ thuật', desc: 'HTML semantic, meta tags đầy đủ, tốc độ cao — giúp Google tìm thấy bạn dễ hơn và xếp hạng cao hơn đối thủ.' },
  { icon: '🛡️', title: 'Bảo mật & Ổn định 99.9%', desc: 'Deploy trên hạ tầng GitHub + CDN toàn cầu — uptime 99.9%, không bao giờ bị down, bảo mật cấp enterprise.' },
  { icon: '🔄', title: 'Cập nhật linh hoạt', desc: 'Muốn thay đổi nội dung, thêm dịch vụ mới? Chúng tôi cập nhật nhanh chóng, không cần bạn biết code.' },
]

const packages = [
  {
    name: 'Khởi nghiệp',
    price: '2.900.000đ',
    time: '7 ngày',
    color: '#64748b',
    features: [
      '✅ 1 trang landing page',
      '✅ Responsive mobile',
      '✅ Form liên hệ',
      '✅ SEO cơ bản',
      '✅ Bàn giao 7 ngày',
      '❌ Tên miền riêng',
      '❌ Chỉnh sửa sau bàn giao',
    ],
  },
  {
    name: 'Chuyên nghiệp',
    price: '5.900.000đ',
    time: '14 ngày',
    color: '#6c63ff',
    featured: true,
    features: [
      '✅ 1 trang landing page',
      '✅ Responsive mobile',
      '✅ Form liên hệ + Zalo OA',
      '✅ SEO nâng cao',
      '✅ Tên miền .com 1 năm',
      '✅ Bàn giao 14 ngày',
      '✅ 3 lần chỉnh sửa miễn phí',
    ],
  },
  {
    name: 'Thương hiệu',
    price: '9.900.000đ',
    time: '21 ngày',
    color: '#f59e0b',
    features: [
      '✅ Trang landing page cao cấp',
      '✅ Responsive + Animation',
      '✅ Form + CRM cơ bản',
      '✅ SEO chuyên sâu + Blog',
      '✅ Tên miền + Hosting 1 năm',
      '✅ Bàn giao 21 ngày',
      '✅ Hỗ trợ 6 tháng',
    ],
  },
]

const stats = [
  { number: '50+', label: 'Khách hàng tin tưởng' },
  { number: '98%', label: 'Hài lòng sau bàn giao' },
  { number: '<1s', label: 'Tốc độ tải trang' },
  { number: '24/7', label: 'Hỗ trợ sau bàn giao' },
]

export default function App() {
  const [form, setForm] = useState({ name: '', phone: '', job: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="app">

      {/* NAV */}
      <nav className="nav">
        <div className="logo">⚡ GIÁP TECH</div>
        <ul className="nav-links">
          <li><a href="#pain">Vấn đề</a></li>
          <li><a href="#why">Tại sao</a></li>
          <li><a href="#services">Đối tượng</a></li>
          <li><a href="#pricing">Bảng giá</a></li>
        </ul>
        <a href="#contact" className="btn-primary nav-cta">Tư vấn miễn phí</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🚀 Chuyên gia xây dựng thương hiệu cá nhân</div>
          <h1>
            Bạn giỏi chuyên môn —<br />
            <span className="gradient">Hãy để thế giới biết điều đó</span>
          </h1>
          <p className="hero-sub">
            GIÁP TECH tạo ra landing page cá nhân chuyên nghiệp giúp huấn luyện viên, giáo viên,
            môi giới và chuyên gia các ngành <strong>thu hút khách hàng tự động</strong> — ngay cả khi bạn đang ngủ.
          </p>
          <div className="hero-btns">
            <a href="#contact" className="btn-primary btn-lg">Đặt lịch tư vấn miễn phí 🎯</a>
            <a href="#services" className="btn-outline btn-lg">Xem phù hợp với tôi không</a>
          </div>
          <div className="hero-stats">
            {stats.map((s, i) => (
              <div className="stat" key={i}>
                <strong>{s.number}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAIN */}
      <section className="pain" id="pain">
        <div className="container">
          <div className="section-label">Bạn có đang gặp phải?</div>
          <h2>Những vấn đề khiến bạn<br /><span className="gradient">mất khách hàng mỗi ngày</span></h2>
          <div className="pain-grid">
            {pains.map((p, i) => (
              <div className="pain-card" key={i}>
                <span className="pain-icon">{p.icon}</span>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
          <div className="pain-solution">
            <p>👉 <strong>Nếu bạn gật đầu với bất kỳ điều nào trên</strong> — bạn đang cần một landing page cá nhân chuyên nghiệp.</p>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="why" id="why">
        <div className="container">
          <div className="section-label">Tại sao cần thương hiệu cá nhân</div>
          <h2>Trong thời đại số, <span className="gradient">người ta Google bạn<br />trước khi gặp bạn</span></h2>
          <div className="why-content">
            <div className="why-text">
              <p>Hãy thử nghĩ: khi bạn cần một huấn luyện viên cá nhân, bạn làm gì đầu tiên? Bạn <strong>tìm kiếm trên Google</strong> hoặc hỏi bạn bè, rồi <strong>vào trang web để đánh giá</strong> người đó có đáng tin không.</p>
              <p>Khách hàng của bạn cũng vậy. Họ đang Google tên bạn ngay lúc này. Câu hỏi là: <strong>họ tìm thấy gì?</strong></p>
              <div className="why-compare">
                <div className="compare-bad">
                  <h4>❌ Không có thương hiệu</h4>
                  <ul>
                    <li>Khách tìm không thấy hoặc thấy đối thủ</li>
                    <li>Trông không chuyên nghiệp</li>
                    <li>Khó tính giá cao</li>
                    <li>Phụ thuộc hoàn toàn vào referral</li>
                  </ul>
                </div>
                <div className="compare-good">
                  <h4>✅ Có landing page chuyên nghiệp</h4>
                  <ul>
                    <li>Khách tự tìm đến, tự điền form</li>
                    <li>Uy tín cao, dễ tính giá premium</li>
                    <li>Thu leads 24/7 kể cả lúc ngủ</li>
                    <li>Khác biệt hoàn toàn với đối thủ</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-label">Công nghệ & Khả năng</div>
          <h2>Không chỉ là "làm web" —<br /><span className="gradient">chúng tôi xây dựng cỗ máy thu khách</span></h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services" id="services">
        <div className="container">
          <div className="section-label">Đối tượng phù hợp</div>
          <h2>Chúng tôi tạo landing page cho<br /><span className="gradient">những ai muốn trở thành số 1 trong ngành</span></h2>
          <div className="services-grid">
            {services.map((s, i) => (
              <div className="service-card" key={i}>
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing" id="pricing">
        <div className="container">
          <div className="section-label">Đầu tư cho thương hiệu</div>
          <h2>Gói dịch vụ <span className="gradient">minh bạch, không phát sinh</span></h2>
          <p className="pricing-sub">So với chi phí chạy quảng cáo mỗi tháng, đây là khoản đầu tư một lần — sinh lời mãi mãi.</p>
          <div className="pricing-grid">
            {packages.map((pkg, i) => (
              <div className={`pricing-card ${pkg.featured ? 'featured' : ''}`} key={i} style={{'--pkg-color': pkg.color}}>
                {pkg.featured && <div className="badge">⭐ Phổ biến nhất</div>}
                <h3>{pkg.name}</h3>
                <div className="price">{pkg.price}</div>
                <div className="price-time">⏱ Bàn giao trong {pkg.time}</div>
                <ul>
                  {pkg.features.map((f, j) => <li key={j}>{f}</li>)}
                </ul>
                <a href="#contact" className={pkg.featured ? 'btn-primary' : 'btn-outline'}>Chọn gói này</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact" id="contact">
        <div className="container">
          <div className="section-label">Bắt đầu ngay hôm nay</div>
          <h2>Tư vấn <span className="gradient">miễn phí 100%</span> — Không ép mua</h2>
          <p className="contact-sub">Chỉ cần 15 phút, chúng tôi sẽ cho bạn thấy landing page của bạn sẽ trông như thế nào và mang lại bao nhiêu khách hàng.</p>
          <div className="contact-wrap">
            <div className="contact-info">
              <h3>Liên hệ trực tiếp</h3>
              <a href="tel:0352425290" className="contact-item">
                <span>📞</span>
                <div>
                  <strong>Gọi điện</strong>
                  <p>0352 425 290</p>
                </div>
              </a>
              <a href="https://zalo.me/0352425290" target="_blank" rel="noreferrer" className="contact-item">
                <span>💬</span>
                <div>
                  <strong>Nhắn Zalo</strong>
                  <p>0352 425 290</p>
                </div>
              </a>
              <div className="contact-note">
                <p>⏰ Phản hồi trong vòng <strong>30 phút</strong> (8:00 - 22:00)</p>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              {sent ? (
                <div className="form-success">
                  <div className="success-icon">🎉</div>
                  <h3>Đã nhận thông tin!</h3>
                  <p>Chúng tôi sẽ liên hệ lại trong 30 phút. Cảm ơn bạn!</p>
                </div>
              ) : (
                <>
                  <h3>Để lại thông tin tư vấn</h3>
                  <input
                    type="text"
                    placeholder="Họ và tên *"
                    required
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                  />
                  <input
                    type="tel"
                    placeholder="Số điện thoại / Zalo *"
                    required
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                  />
                  <select
                    value={form.job}
                    onChange={e => setForm({...form, job: e.target.value})}
                    required
                  >
                    <option value="">Nghề nghiệp của bạn *</option>
                    <option>Huấn luyện viên PT / Yoga</option>
                    <option>Giáo viên / Gia sư</option>
                    <option>Môi giới Bất động sản</option>
                    <option>Môi giới Xe ô tô</option>
                    <option>Tư vấn Tài chính / Bảo hiểm</option>
                    <option>Chuyên gia Sắc đẹp / Spa</option>
                    <option>Khác</option>
                  </select>
                  <button type="submit" className="btn-primary btn-lg">
                    Đăng ký tư vấn miễn phí 🚀
                  </button>
                  <p className="form-note">🔒 Thông tin của bạn được bảo mật tuyệt đối</p>
                </>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">⚡ GIÁP TECH</div>
        <p>Chuyên gia xây dựng thương hiệu cá nhân cho người Việt</p>
        <p>📞 0352 425 290 · 💬 Zalo: 0352 425 290 · 🌐 giaptech.site</p>
        <p className="footer-copy">© 2026 GIÁP TECH. All rights reserved.</p>
      </footer>

    </div>
  )
}
