import { useState } from 'react'
import './App.css'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      {/* Demo Banner */}
      <div className="demo-banner">🚧 DEMO — Chưa được duyệt chính thức</div>
      {/* Hero */}
      <section className="hero">
        <nav className="nav">
          <div className="logo">🐾 BrandPage</div>
          <ul className="nav-links">
            <li><a href="#features">Tính năng</a></li>
            <li><a href="#pricing">Bảng giá</a></li>
            <li><a href="#contact">Liên hệ</a></li>
          </ul>
          <button className="btn-primary">Bắt đầu ngay</button>
        </nav>

        <div className="hero-content">
          <h1>Thiết kế landing page<br /><span className="gradient">chuyên nghiệp</span></h1>
          <p>Tạo trang landing page đẹp, nhanh, chuẩn SEO trong vài phút. Không cần biết code.</p>
          <div className="hero-btns">
            <button className="btn-primary btn-lg">Dùng thử miễn phí</button>
            <button className="btn-outline btn-lg">Xem demo</button>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>500+</strong><span>Khách hàng</span></div>
            <div className="stat"><strong>98%</strong><span>Hài lòng</span></div>
            <div className="stat"><strong>24/7</strong><span>Hỗ trợ</span></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <h2>Tại sao chọn chúng tôi?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Siêu nhanh</h3>
            <p>Tốc độ tải trang dưới 1 giây, tối ưu Core Web Vitals.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile-first</h3>
            <p>Giao diện đẹp trên mọi thiết bị từ điện thoại đến máy tính.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Tối ưu chuyển đổi</h3>
            <p>Thiết kế theo nghiên cứu hành vi người dùng, tăng tỷ lệ chuyển đổi.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Chuẩn SEO</h3>
            <p>Cấu trúc HTML semantic, meta tags đầy đủ, dễ lên top Google.</p>
          </div>
        </div>
      </section>

      {/* Counter demo */}
      <section className="counter-section">
        <h2>Interactive Demo</h2>
        <p>React hoạt động bình thường 👇</p>
        <div className="counter">
          <button onClick={() => setCount(c => c - 1)}>−</button>
          <span>{count}</span>
          <button onClick={() => setCount(c => c + 1)}>+</button>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing" id="pricing">
        <h2>Bảng giá</h2>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Cơ bản</h3>
            <div className="price">2.500.000đ</div>
            <ul>
              <li>✅ 1 trang landing page</li>
              <li>✅ Responsive design</li>
              <li>✅ Bàn giao 7 ngày</li>
              <li>❌ SEO nâng cao</li>
            </ul>
            <button className="btn-outline">Chọn gói này</button>
          </div>
          <div className="pricing-card featured">
            <div className="badge">Phổ biến</div>
            <h3>Chuyên nghiệp</h3>
            <div className="price">4.900.000đ</div>
            <ul>
              <li>✅ 1 trang landing page</li>
              <li>✅ Responsive design</li>
              <li>✅ Bàn giao 14 ngày</li>
              <li>✅ SEO nâng cao</li>
            </ul>
            <button className="btn-primary">Chọn gói này</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <p>© 2026 BrandPage. Made with ❤️ in Vietnam</p>
        <p>📞 0352 425 290 · ✉️ hello@giaptech.site</p>
      </footer>
    </div>
  )
}
